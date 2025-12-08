import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/saved/scholarships - Save a scholarship
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scholarshipId } = await req.json()

    if (!scholarshipId) {
      return NextResponse.json({ error: "Scholarship ID required" }, { status: 400 })
    }

    const saved = await prisma.savedScholarship.create({
      data: {
        userId: session.user.id,
        scholarshipId,
      },
      include: {
        scholarship: true
      }
    })

    return NextResponse.json({ 
      message: "Scholarship saved successfully",
      saved 
    }, { status: 201 })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Scholarship already saved" }, { status: 400 })
    }
    console.error("Save scholarship error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/saved/scholarships - Get saved scholarships
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const saved = await prisma.savedScholarship.findMany({
      where: { userId: session.user.id },
      include: {
        scholarship: true
      },
      orderBy: { createdAt: "desc" }
    })

    const scholarships = saved.map((s: any) => s.scholarship);
    return NextResponse.json({ scholarships })
  } catch (error) {
    console.error("Fetch saved scholarships error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/saved/scholarships - Unsave a scholarship
export async function DELETE(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scholarshipId } = await req.json()

    await prisma.savedScholarship.deleteMany({
      where: {
        userId: session.user.id,
        scholarshipId,
      }
    })

    return NextResponse.json({ message: "Scholarship unsaved successfully" })
  } catch (error) {
    console.error("Unsave scholarship error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
