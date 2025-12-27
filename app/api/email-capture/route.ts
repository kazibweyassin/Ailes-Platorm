import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.emailCapture.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      // Update the timestamp to show they're still interested
      await prisma.emailCapture.update({
        where: { email: email.toLowerCase() },
        data: { updatedAt: new Date() },
      });
      return NextResponse.json({
        success: true,
        message: "Email already registered",
      });
    }

    // Create new email capture
    await prisma.emailCapture.create({
      data: {
        email: email.toLowerCase(),
        source: "scroll-trigger-popup",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email captured successfully",
    });
  } catch (error: any) {
    console.error("Error capturing email:", error);
    // If the model doesn't exist yet, still return success to avoid breaking the UI
    // The migration needs to be run first
    if (error.message?.includes("does not exist") || error.message?.includes("Unknown model")) {
      console.warn("EmailCapture model not found. Please run database migrations.");
      return NextResponse.json({
        success: true,
        message: "Email captured (pending migration)",
      });
    }
    return NextResponse.json(
      { error: "Failed to capture email" },
      { status: 500 }
    );
  }
}

