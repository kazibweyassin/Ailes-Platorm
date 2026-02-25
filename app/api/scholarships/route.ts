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
    const coversTuition = searchParams.get("coversTuition") === "true"
    const coversLiving = searchParams.get("coversLiving") === "true"
    const noTestRequired = searchParams.get("noTestRequired") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}
    const andConditions: any[] = []

    // Flexible country matching - check country field OR targetCountries array
    if (country) {
      andConditions.push({
        OR: [
          { country: { contains: country, mode: "insensitive" } },
          { targetCountries: { hasSome: [country] } },
          { country: { contains: "Multiple", mode: "insensitive" } }, // Include "Multiple Countries"
          { country: { contains: "Pan-African", mode: "insensitive" } }, // Include "Pan-African"
        ]
      })
    }

    if (type) {
      andConditions.push({ type })
    }

    if (forWomen) {
      andConditions.push({ forWomen: true })
    }

    if (forAfrican) {
      andConditions.push({ forAfrican: true })
    }

    // Flexible field of study matching - use text search instead of array matching
    // This is more forgiving since fieldOfStudy values in DB may not exactly match user input
    if (fieldOfStudy) {
      andConditions.push({
        OR: [
          { description: { contains: fieldOfStudy, mode: "insensitive" } },
          { name: { contains: fieldOfStudy, mode: "insensitive" } },
          { eligibility: { contains: fieldOfStudy, mode: "insensitive" } },
        ]
      })
    }

    // Flexible degree level matching - properly handle the enum
    if (degreeLevel) {
      // Map common variations to correct enum values
      const degreeLevelMap: Record<string, string> = {
        'BACHELORS': 'BACHELOR',
        'BACHELOR': 'BACHELOR',
        'MASTERS': 'MASTER', 
        'MASTER': 'MASTER',
        'PHD': 'PHD',
        'DOCTORATE': 'PHD',
        'DIPLOMA': 'DIPLOMA',
        'CERTIFICATE': 'CERTIFICATE',
      }
      const normalizedLevel = degreeLevelMap[degreeLevel.toUpperCase()] || degreeLevel.toUpperCase()
      
      // Only filter if it's a valid enum value
      const validLevels = ['BACHELOR', 'MASTER', 'PHD', 'DIPLOMA', 'CERTIFICATE']
      if (validLevels.includes(normalizedLevel)) {
        andConditions.push({
          degreeLevel: { has: normalizedLevel as any }
        })
      }
    }

    if (minAmount || maxAmount) {
      const amountCondition: any = {}
      if (minAmount) amountCondition.gte = parseFloat(minAmount)
      if (maxAmount) amountCondition.lte = parseFloat(maxAmount)
      andConditions.push({ amount: amountCondition })
    }

    if (deadline) {
      const now = new Date()
      const deadlineCondition: any = { gte: now }
      
      if (deadline === "thisMonth") {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        deadlineCondition.lte = endOfMonth
      } else if (deadline === "nextMonth") {
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)
        deadlineCondition.gte = startOfNextMonth
        deadlineCondition.lte = endOfNextMonth
      }
      andConditions.push({ deadline: deadlineCondition })
    }

    if (featured) {
      andConditions.push({ featured: true })
    }

    // Coverage filters
    if (coversTuition) {
      andConditions.push({ coversTuition: true })
    }

    if (coversLiving) {
      andConditions.push({ coversLiving: true })
    }

    // No test required filter
    if (noTestRequired) {
      andConditions.push({
        AND: [
          { requiresIELTS: false },
          { requiresTOEFL: false },
          { requiresGRE: false },
          { requiresGMAT: false }
        ]
      })
    }

    // Flexible text search across multiple fields
    if (search) {
      const searchTerms = search.split(' ').filter(s => s.length > 2)
      const searchConditions = searchTerms.map(term => ({
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { provider: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { country: { contains: term, mode: "insensitive" } },
          { eligibility: { contains: term, mode: "insensitive" } },
        ]
      }))
      
      if (searchConditions.length > 0) {
        // Use OR for search terms to be more flexible
        andConditions.push({ OR: searchConditions.map(c => c) })
      }
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      where.AND = andConditions
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
