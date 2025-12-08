import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/scholarships/deadlines - Get upcoming scholarship deadlines
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "90") // Next 90 days by default

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date(),
          lte: endDate
        }
      },
      orderBy: {
        deadline: "asc"
      },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    // Group by month
    const grouped = scholarships.reduce((acc: any, scholarship: any) => {
      if (!scholarship.deadline) return acc
      
      const month = scholarship.deadline.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long" 
      })
      
      if (!acc[month]) {
        acc[month] = []
      }
      
      acc[month].push({
        ...scholarship,
        daysUntilDeadline: Math.ceil((scholarship.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      })
      
      return acc
    }, {})

    return NextResponse.json({ 
      scholarships: scholarships,
      deadlines: grouped,
      total: scholarships.length
    })
  } catch (error) {
    console.error("Deadlines fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
