import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Calculate scholarship match score based on user profile
function calculateMatchScore(user: any, scholarship: any): { score: number; reasons: string[]; missing: string[] } {
  let score = 0
  const reasons: string[] = []
  const missing: string[] = []
  const maxScore = 100

  // Country match (20 points)
  if (scholarship.targetCountries.length > 0) {
    if (user.country && scholarship.targetCountries.includes(user.country)) {
      score += 20
      reasons.push(`Available for students from ${user.country}`)
    } else {
      missing.push(`Must be from: ${scholarship.targetCountries.join(", ")}`)
    }
  } else {
    score += 20 // No country restriction
  }

  // GPA requirement (15 points)
  if (scholarship.minGPA) {
    if (user.currentGPA && user.currentGPA >= scholarship.minGPA) {
      score += 15
      reasons.push(`Your GPA (${user.currentGPA}) meets the requirement`)
    } else {
      missing.push(`Minimum GPA ${scholarship.minGPA} required${user.currentGPA ? ` (you have ${user.currentGPA})` : ""}`)
    }
  } else {
    score += 15
  }

  // Field of study match (15 points)
  if (scholarship.fieldOfStudy.length > 0) {
    if (user.fieldOfStudy && scholarship.fieldOfStudy.includes(user.fieldOfStudy)) {
      score += 15
      reasons.push(`Matches your field: ${user.fieldOfStudy}`)
    } else {
      missing.push(`Field must be: ${scholarship.fieldOfStudy.join(", ")}`)
    }
  } else {
    score += 15
  }

  // Degree level match (10 points)
  if (scholarship.degreeLevel.length > 0) {
    if (user.degreeLevel && scholarship.degreeLevel.includes(user.degreeLevel)) {
      score += 10
      reasons.push(`Available for ${user.degreeLevel} students`)
    } else {
      missing.push(`Only for: ${scholarship.degreeLevel.join(", ")}`)
    }
  } else {
    score += 10
  }

  // Age requirement (10 points)
  if (scholarship.minAge || scholarship.maxAge) {
    if (user.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      const meetsMin = !scholarship.minAge || age >= scholarship.minAge
      const meetsMax = !scholarship.maxAge || age <= scholarship.maxAge
      
      if (meetsMin && meetsMax) {
        score += 10
        reasons.push(`Age requirement met`)
      } else {
        missing.push(`Age must be ${scholarship.minAge || "any"}-${scholarship.maxAge || "any"}`)
      }
    }
  } else {
    score += 10
  }

  // Gender-specific scholarships (10 points)
  if (scholarship.forWomen) {
    if (user.gender?.toLowerCase() === "female") {
      score += 10
      reasons.push(`Specifically for women`)
    } else {
      missing.push(`Only for women applicants`)
    }
  } else {
    score += 10
  }

  // Test scores (20 points total)
  let testScore = 0
  if (scholarship.requiresIELTS) {
    if (user.ieltsScore && scholarship.minIELTS && user.ieltsScore >= scholarship.minIELTS) {
      testScore += 5
      reasons.push(`IELTS ${user.ieltsScore} meets requirement`)
    } else {
      missing.push(`IELTS ${scholarship.minIELTS || "score"} required`)
    }
  } else {
    testScore += 5
  }

  if (scholarship.requiresTOEFL) {
    if (user.toeflScore && scholarship.minTOEFL && user.toeflScore >= scholarship.minTOEFL) {
      testScore += 5
      reasons.push(`TOEFL ${user.toeflScore} meets requirement`)
    } else {
      missing.push(`TOEFL ${scholarship.minTOEFL || "score"} required`)
    }
  } else {
    testScore += 5
  }

  if (scholarship.requiresGRE) {
    if (user.greScore) {
      testScore += 5
      reasons.push(`GRE score on file`)
    } else {
      missing.push(`GRE score required`)
    }
  } else {
    testScore += 5
  }

  if (scholarship.requiresGMAT) {
    if (user.gmatScore) {
      testScore += 5
      reasons.push(`GMAT score on file`)
    } else {
      missing.push(`GMAT score required`)
    }
  } else {
    testScore += 5
  }

  score += testScore

  return { 
    score: Math.min(score, maxScore), 
    reasons, 
    missing 
  }
}

// POST /api/scholarships/match - Match scholarships with provided profile data
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const profile = body.profile

    if (!profile) {
      return NextResponse.json({ error: "Profile data required" }, { status: 400 })
    }

    // Get all active scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date() // Only future deadlines
        }
      }
    })

    // Calculate match scores
    const matches = scholarships.map((scholarship: any) => {
      const { score, reasons, missing } = calculateMatchScore(profile, scholarship)
      return {
        scholarship,
        matchScore: score,
        matchReasons: reasons,
        missingRequirements: missing
      }
    })

    // Sort by match score
    matches.sort((a: any, b: any) => b.matchScore - a.matchScore)

    return NextResponse.json({ 
      matches: matches.slice(0, 50), // Return top 50
      totalMatches: matches.length,
      perfectMatches: matches.filter((m: any) => m.matchScore === 100).length,
      goodMatches: matches.filter((m: any) => m.matchScore >= 80).length
    })
  } catch (error) {
    console.error("Scholarship matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/scholarships/match - Get AI-matched scholarships for logged-in user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all active scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date() // Only future deadlines
        }
      }
    })

    // Calculate match scores
    const matches = scholarships.map((scholarship: any) => {
      const { score, reasons, missing } = calculateMatchScore(user, scholarship)
      return {
        scholarship,
        matchScore: score,
        matchReasons: reasons,
        missingRequirements: missing
      }
    })

    // Sort by match score
    matches.sort((a: any, b: any) => b.matchScore - a.matchScore)

    // Save top matches to database for later reference
    const topMatches = matches.slice(0, 20).filter((m: any) => m.matchScore >= 50)
    
    await Promise.all(
      topMatches.map((match: any) =>
        prisma.scholarshipMatch.upsert({
          where: {
            userId_scholarshipId: {
              userId: user.id,
              scholarshipId: match.scholarship.id
            }
          },
          create: {
            userId: user.id,
            scholarshipId: match.scholarship.id,
            matchScore: match.matchScore,
            matchReasons: match.matchReasons,
            missingRequirements: match.missingRequirements
          },
          update: {
            matchScore: match.matchScore,
            matchReasons: match.matchReasons,
            missingRequirements: match.missingRequirements
          }
        })
      )
    )

    return NextResponse.json({ 
      matches: matches.slice(0, 50), // Return top 50
      totalMatches: matches.length,
      perfectMatches: matches.filter((m: any) => m.matchScore === 100).length,
      goodMatches: matches.filter((m: any) => m.matchScore >= 80).length
    })
  } catch (error) {
    console.error("Scholarship matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
