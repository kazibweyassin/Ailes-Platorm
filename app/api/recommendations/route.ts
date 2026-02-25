import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateMatchScore, rankScholarships, findHiddenGems } from "@/lib/matching-engine"

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/recommendations - Get personalized scholarship recommendations
 * 
 * Query params:
 * - type: "top" | "gems" | "trending"
 * - limit: number (default: 10)
 */
export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "top" // top, gems, trending
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        currentGPA: true,
        ieltsScore: true,
        toeflScore: true,
        greScore: true,
        gmatScore: true,
        fieldOfStudy: true,
        degreeLevel: true,
        country: true,
        interestedCountries: true,
        dateOfBirth: true,
        gender: true,
        savedScholarships: {
          select: { scholarshipId: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all active scholarships
    const allScholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date() // Only future deadlines
        }
      },
      select: {
        id: true,
        name: true,
        country: true,
        minGPA: true,
        degreeLevel: true,
        fieldOfStudy: true,
        forWomen: true,
        forAfrican: true,
        requiresIELTS: true,
        minIELTS: true,
        requiresTOEFL: true,
        minTOEFL: true,
        requiresGRE: true,
        requiresGMAT: true,
        deadline: true,
        amount: true,
        views: true,
        featured: true,
        provider: true,
        description: true,
        type: true
      }
    })

    const savedIds = new Set(user.savedScholarships.map(s => s.scholarshipId))

    let recommendations

    if (type === "gems") {
      // Hidden gems - good matches with low visibility
      recommendations = findHiddenGems(user as any, allScholarships as any, 70, 100)
    } else if (type === "trending") {
      // Trending - high views + good match
      const scores = rankScholarships(user as any, allScholarships as any)
      recommendations = scores
        .filter(s => {
          const scholarship = allScholarships.find(sch => sch.id === s.scholarshipId)
          return (scholarship?.views || 0) > 50
        })
        .slice(0, limit)
    } else {
      // Top matches (default)
      recommendations = rankScholarships(user as any, allScholarships as any).slice(0, limit)
    }

    // Enrich with full scholarship data
    const enriched = recommendations.map(rec => {
      const fullScholarship = allScholarships.find(s => s.id === rec.scholarshipId)
      return {
        ...rec,
        scholarship: {
          ...fullScholarship,
          isSaved: savedIds.has(rec.scholarshipId)
        }
      }
    })

    return NextResponse.json({
      type,
      total: enriched.length,
      recommendations: enriched,
      userProfile: {
        gpa: user.currentGPA,
        fieldOfStudy: user.fieldOfStudy,
        degreeLevel: user.degreeLevel,
        country: user.country,
        interestedCountries: user.interestedCountries
      }
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error("Recommendations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
