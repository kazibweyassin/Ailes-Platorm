import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering for production
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/scholarships - Get all scholarships with advanced filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const country = searchParams.get("country")
    const type = searchParams.get("type")
    const forWomen = searchParams.get("forWomen") === "true"
    const forAfrican = searchParams.get("forAfrican") === "true"
    const search = searchParams.get("search")
    const fieldOfStudy = searchParams.get("fieldOfStudy")
    const degreeLevel = searchParams.get("degreeLevel")
    const minAmount = searchParams.get("minAmount")
    const maxAmount = searchParams.get("maxAmount")
    const deadline = searchParams.get("deadline") // "upcoming", "thisMonth", "nextMonth"
    const featured = searchParams.get("featured") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (country) {
      where.OR = [
        { country },
        { targetCountries: { has: country } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (forWomen) {
      where.forWomen = true
    }

    if (forAfrican) {
      where.forAfrican = true
    }

    if (fieldOfStudy) {
      where.fieldOfStudy = { has: fieldOfStudy }
    }

    if (degreeLevel) {
      where.degreeLevel = { has: degreeLevel as any }
    }

    if (minAmount || maxAmount) {
      where.amount = {}
      if (minAmount) where.amount.gte = parseFloat(minAmount)
      if (maxAmount) where.amount.lte = parseFloat(maxAmount)
    }

    if (deadline) {
      const now = new Date()
      where.deadline = { gte: now }
      
      if (deadline === "thisMonth") {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        where.deadline.lte = endOfMonth
      } else if (deadline === "nextMonth") {
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)
        where.deadline.gte = startOfNextMonth
        where.deadline.lte = endOfNextMonth
      }
    }

    if (featured) {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { provider: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: "desc" },
          { deadline: "asc" },
          { createdAt: "desc" }
        ],
        include: {
          _count: {
            select: { applications: true, savedBy: true }
          }
        }
      }),
      prisma.scholarship.count({ where })
    ])

    // Calculate days until deadline for each
    const enriched = scholarships.map((s: any) => ({
      ...s,
      daysUntilDeadline: s.deadline 
        ? Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      isUrgent: s.deadline 
        ? Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 30
        : false
    }))

    return NextResponse.json({
      scholarships: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Scholarships fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/scholarships - Create scholarship (Admin only)
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const scholarship = await prisma.scholarship.create({
      data: body,
    })

    return NextResponse.json({ 
      message: "Scholarship created successfully",
      scholarship 
    }, { status: 201 })
  } catch (error) {
    console.error("Scholarship create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
