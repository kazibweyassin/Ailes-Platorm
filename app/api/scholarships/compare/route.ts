import { NextResponse } from "next/server"

// GET /api/scholarships/compare - Compare multiple scholarships
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get("ids")?.split(",") || []

    if (ids.length === 0 || ids.length > 5) {
      return NextResponse.json(
        { error: "Please provide 1-5 scholarship IDs" },
        { status: 400 }
      )
    }

    const { prisma } = await import("@/lib/prisma")
    
    const scholarships = await prisma.scholarship.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        _count: {
          select: { applications: true, savedBy: true }
        }
      }
    })

    // Create comparison matrix
    const comparison = {
      scholarships,
      comparison: {
        funding: scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          amount: s.amount,
          currency: s.currency,
          type: s.type,
          coversTuition: s.coversTuition,
          coversLiving: s.coversLiving,
          coversTravel: s.coversTravel,
          coversBooks: s.coversBooks
        })),
        requirements: scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          minGPA: s.minGPA,
          requiresIELTS: s.requiresIELTS,
          minIELTS: s.minIELTS,
          requiresTOEFL: s.requiresTOEFL,
          minTOEFL: s.minTOEFL,
          requiresGRE: s.requiresGRE,
          requiresGMAT: s.requiresGMAT,
          minAge: s.minAge,
          maxAge: s.maxAge
        })),
        eligibility: scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          degreeLevel: s.degreeLevel,
          fieldOfStudy: s.fieldOfStudy,
          targetCountries: s.targetCountries,
          forWomen: s.forWomen,
          forAfrican: s.forAfrican
        })),
        deadlines: scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          deadline: s.deadline,
          applicationOpenDate: s.applicationOpenDate,
          daysRemaining: s.deadline 
            ? Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null
        })),
        popularity: scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          views: s.views,
          applications: s._count.applications,
          savedBy: s._count.savedBy
        }))
      }
    }

    return NextResponse.json(comparison)
  } catch (error) {
    console.error("Scholarship comparison error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
