import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Force dynamic rendering - critical for production
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'
export const revalidate = 0

// GET /api/scholarships/[id] - Get single scholarship
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params - required in Next.js 15
    const { id } = await params
    
    // Validate ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ 
        error: "Invalid scholarship ID",
        received: id 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Check if scholarship exists first
    let exists;
    try {
      exists = await prisma.scholarship.findUnique({
      where: { id }
    })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json({ 
        error: "Database connection error",
        message: process.env.NODE_ENV === 'development' ? dbError?.message : undefined
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!exists) {
      return NextResponse.json({ 
        error: "Scholarship not found",
        id: id 
      }, { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Increment view count
    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        _count: {
          select: { 
            applications: true,
            savedBy: true 
          }
        }
      }
    })

    // Calculate days until deadline
    const daysUntilDeadline = scholarship.deadline 
      ? Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null

    return NextResponse.json({ 
      scholarship: {
        ...scholarship,
        daysUntilDeadline,
        isUrgent: daysUntilDeadline ? daysUntilDeadline <= 30 : false
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    console.error("Scholarship fetch error:", error)
    // Ensure we always return JSON, not HTML
    return NextResponse.json({ 
      error: error?.message || "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

// PATCH /api/scholarships/[id] - Update scholarship (admin only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Convert deadline to Date if provided
    if (data.deadline) {
      data.deadline = new Date(data.deadline)
    }

    // Convert numeric fields
    if (data.amount) data.amount = parseFloat(data.amount)
    if (data.minGPA) data.minGPA = parseFloat(data.minGPA)
    if (data.minIELTS) data.minIELTS = parseFloat(data.minIELTS)
    if (data.minTOEFL) data.minTOEFL = parseInt(data.minTOEFL)
    if (data.minGRE) data.minGRE = parseInt(data.minGRE)
    if (data.minGMAT) data.minGMAT = parseInt(data.minGMAT)
    if (data.minAge) data.minAge = parseInt(data.minAge)
    if (data.maxAge) data.maxAge = parseInt(data.maxAge)

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data
    })

    return NextResponse.json({ scholarship })
  } catch (error) {
    console.error("Scholarship update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/scholarships/[id] - Delete scholarship (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.scholarship.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Scholarship deleted successfully" })
  } catch (error) {
    console.error("Scholarship delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
