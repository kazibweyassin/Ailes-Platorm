import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const applicationSchema = z.object({
  universityId: z.string().optional(),
  scholarshipId: z.string().optional(),
  programName: z.string().optional(),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA", "CERTIFICATE"]).optional(),
  intakeYear: z.number().optional(),
  intakeSeason: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/applications - Get user's applications
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as any }),
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            logo: true,
          }
        },
        scholarship: {
          select: {
            id: true,
            name: true,
            provider: true,
            amount: true,
            currency: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/applications - Create new application
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = applicationSchema.parse(body)

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        ...validatedData,
        status: "DRAFT",
      },
      include: {
        university: true,
        scholarship: true,
      }
    })

    return NextResponse.json(
      { 
        message: "Application created successfully",
        application 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Application create error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
