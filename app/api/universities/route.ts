import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/universities - Get all universities with filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const country = searchParams.get("country")
    const search = searchParams.get("search")
    const minRanking = searchParams.get("minRanking")
    const maxRanking = searchParams.get("maxRanking")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}

    if (country) {
      where.country = country
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ]
    }

    if (minRanking || maxRanking) {
      where.ranking = {}
      if (minRanking) where.ranking.gte = parseInt(minRanking)
      if (maxRanking) where.ranking.lte = parseInt(maxRanking)
    }

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        include: {
          programs: {
            take: 5,
          },
          _count: {
            select: { programs: true }
          }
        },
        skip,
        take: limit,
        orderBy: { ranking: "asc" }
      }),
      prisma.university.count({ where })
    ])

    return NextResponse.json({
      universities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Universities fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/universities - Create university (Admin only)
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const university = await prisma.university.create({
      data: body,
    })

    return NextResponse.json({ 
      message: "University created successfully",
      university 
    }, { status: 201 })
  } catch (error) {
    console.error("University create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
