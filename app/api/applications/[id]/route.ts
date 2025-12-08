import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/applications/[id] - Get single application
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        university: true,
        scholarship: true,
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Application fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/applications/[id] - Update application
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: body,
      include: {
        university: true,
        scholarship: true,
      }
    })

    return NextResponse.json({ 
      message: "Application updated successfully",
      application: updated 
    })
  } catch (error) {
    console.error("Application update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    await prisma.application.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Application deleted successfully" })
  } catch (error) {
    console.error("Application delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
