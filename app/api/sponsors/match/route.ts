import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/sponsors/match - Match a sponsor with a scholar
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sponsorId, scholarId, matchNotes } = await req.json();

    if (!sponsorId || !scholarId) {
      return NextResponse.json(
        { error: "Sponsor ID and Scholar ID are required" },
        { status: 400 }
      );
    }

    // Check if sponsor exists and is confirmed
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: sponsorId },
    });

    if (!sponsor) {
      return NextResponse.json(
        { error: "Sponsor not found" },
        { status: 404 }
      );
    }

    if (sponsor.status !== "CONFIRMED" && sponsor.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Sponsor must be confirmed before matching" },
        { status: 400 }
      );
    }

    // Check if scholar exists
    const scholar = await prisma.scholar.findUnique({
      where: { id: scholarId },
    });

    if (!scholar) {
      return NextResponse.json(
        { error: "Scholar not found" },
        { status: 404 }
      );
    }

    // Check if already matched
    const existingMatch = await prisma.sponsorScholar.findUnique({
      where: {
        sponsorId_scholarId: {
          sponsorId,
          scholarId,
        },
      },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: "This sponsor and scholar are already matched" },
        { status: 400 }
      );
    }

    // Create the match
    const match = await prisma.sponsorScholar.create({
      data: {
        sponsorId,
        scholarId,
        matchedBy: session.user?.id || null,
        matchNotes: matchNotes || null,
        status: "MATCHED",
      },
    });

    // Update sponsor status to ACTIVE
    await prisma.sponsor.update({
      where: { id: sponsorId },
      data: { status: "ACTIVE" },
    });

    // Update scholar status
    await prisma.scholar.update({
      where: { id: scholarId },
      data: { 
        status: "MATCHED",
        assignedSponsorId: sponsorId,
      },
    });

    return NextResponse.json({
      message: "Match created successfully",
      match: {
        id: match.id,
        sponsorId: match.sponsorId,
        scholarId: match.scholarId,
        status: match.status,
      },
    });
  } catch (error: any) {
    console.error("Match creation error:", error);
    return NextResponse.json(
      { error: "Failed to create match", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/sponsors/match - Get all matches
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const matches = await prisma.sponsorScholar.findMany({
      include: {
        sponsor: true,
        scholar: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Fetch matches error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

