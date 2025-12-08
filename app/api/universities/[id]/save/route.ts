import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/universities/[id]/save - Save/unsave university
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already saved
    const existing = await prisma.savedUniversity.findFirst({
      where: {
        userId: user.id,
        universityId: params.id
      }
    })

    if (existing) {
      // Unsave
      await prisma.savedUniversity.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ saved: false, message: "University removed from saved list" })
    } else {
      // Save
      await prisma.savedUniversity.create({
        data: {
          userId: user.id,
          universityId: params.id
        }
      })
      return NextResponse.json({ saved: true, message: "University saved successfully" })
    }
  } catch (error) {
    console.error("Save university error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/universities/[id]/save - Check if saved
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ saved: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ saved: false })
    }

    const saved = await prisma.savedUniversity.findFirst({
      where: {
        userId: user.id,
        universityId: params.id
      }
    })

    return NextResponse.json({ saved: !!saved })
  } catch (error) {
    return NextResponse.json({ saved: false })
  }
}
