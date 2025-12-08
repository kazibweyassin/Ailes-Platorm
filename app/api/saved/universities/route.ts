import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/saved/universities - Save a university
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { universityId } = await req.json()

    if (!universityId) {
      return NextResponse.json({ error: "University ID required" }, { status: 400 })
    }

    const saved = await prisma.savedUniversity.create({
      data: {
        userId: session.user.id,
        universityId,
      },
      include: {
        university: true
      }
    })

    return NextResponse.json({ 
      message: "University saved successfully",
      saved 
    }, { status: 201 })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "University already saved" }, { status: 400 })
    }
    console.error("Save university error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/saved/universities - Get saved universities
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const saved = await prisma.savedUniversity.findMany({
      where: { userId: session.user.id },
      include: {
        university: {
          include: {
            _count: {
              select: { programs: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ saved })
  } catch (error) {
    console.error("Fetch saved universities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/saved/universities - Unsave a university
export async function DELETE(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { universityId } = await req.json()

    await prisma.savedUniversity.deleteMany({
      where: {
        userId: session.user.id,
        universityId,
      }
    })

    return NextResponse.json({ message: "University unsaved successfully" })
  } catch (error) {
    console.error("Unsave university error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
