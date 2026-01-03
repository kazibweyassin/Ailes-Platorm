import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/universities/match - Match universities based on user profile
export async function POST(req: Request) {
  try {
    const { gpa, degreeLevel, fieldOfStudy, budget, preferredCountries } = await req.json()

    // Build where clause for filtering
    const where: any = {}

    // Filter by country if specified
    if (preferredCountries && preferredCountries.length > 0) {
      where.country = { in: preferredCountries }
    }

    // Filter by GPA if specified
    if (gpa) {
      const gpaFloat = parseFloat(gpa)
      where.minGPA = { lte: gpaFloat }
    }

    // Get universities with their programs
    const universities = await prisma.university.findMany({
      where,
      include: {
        programs: {
          where: degreeLevel ? { degree: degreeLevel.toUpperCase() } : {},
          take: 3
        },
        _count: {
          select: { 
            savedBy: true,
            applications: true 
          }
        }
      },
      orderBy: { ranking: 'asc' }
    })

    // Calculate match scores
    const matches = universities.map(university => {
      let score = 70 // Base score

      // GPA match
      if (gpa && university.minGPA) {
        const gpaFloat = parseFloat(gpa)
        if (gpaFloat >= university.minGPA + 0.5) score += 15
        else if (gpaFloat >= university.minGPA) score += 10
        else score -= 10
      }

      // Country preference
      if (preferredCountries && preferredCountries.includes(university.country)) {
        score += 10
      }

      // Ranking bonus
      if (university.ranking) {
        if (university.ranking <= 50) score += 10
        else if (university.ranking <= 100) score += 5
      }

      // Budget consideration
      if (budget && university.tuitionMin) {
        const budgetRanges: { [key: string]: number } = {
          "0-10000": 10000,
          "10000-25000": 25000,
          "25000-50000": 50000,
          "50000+": 100000,
          "scholarship": 5000
        }
        const maxBudget = budgetRanges[budget] || 100000
        if (university.tuitionMin <= maxBudget) score += 5
        else score -= 15
      }

      // Program availability
      if (university.programs.length > 0) score += 5

      // Cap score at 100
      score = Math.min(100, Math.max(0, score))

      return {
        id: university.id,
        name: university.name,
        country: university.country,
        city: university.city,
        description: university.description,
        website: university.website,
        logo: university.logo,
        ranking: university.ranking,
        matchScore: score,
        programs: university.programs.map(p => ({
          id: p.id,
          name: p.name,
          degree: p.degree,
          duration: p.duration
        })),
        tuitionMin: university.tuitionMin,
        tuitionMax: university.tuitionMax,
        currency: university.currency,
        minGPA: university.minGPA,
        savedCount: university._count.savedBy,
        applicationCount: university._count.applications
      }
    })

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Return top 12 matches
    return NextResponse.json({ matches: matches.slice(0, 12) })
  } catch (error) {
    console.error("University matching error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
