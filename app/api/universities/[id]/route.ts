import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/universities/[id] - Get single university
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const university = await prisma.university.findUnique({
      where: { id: params.id },
      include: {
        programs: true,
        _count: {
          select: { 
            applications: true,
            savedBy: true 
          }
        }
      }
    })

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    return NextResponse.json({ university })
  } catch (error) {
    console.error("University fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
