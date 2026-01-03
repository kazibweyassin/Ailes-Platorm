import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Quick Apply - One-click application creation
 * Uses user profile data to instantly create an application
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scholarshipId } = await req.json();

    if (!scholarshipId) {
      return NextResponse.json(
        { error: "Scholarship ID required" },
        { status: 400 }
      );
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        scholarshipId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied to this scholarship" },
        { status: 400 }
      );
    }

    // Get scholarship details
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Create application with SUBMITTED status (quick apply)
    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        scholarshipId,
        status: "SUBMITTED",
        programName: scholarship.name,
        degreeLevel: user?.degreeLevel,
        submittedAt: new Date(),
        notes: `Quick applied using profile data on ${new Date().toLocaleDateString()}`,
      },
    });

    return NextResponse.json({
      success: true,
      application,
      message: `Successfully applied to ${scholarship.name}!`,
    });
  } catch (error: any) {
    console.error("Error in quick apply:", error);
    return NextResponse.json(
      { error: "Failed to apply" },
      { status: 500 }
    );
  }
}
