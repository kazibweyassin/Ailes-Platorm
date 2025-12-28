import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/scholars - Submit scholar application
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      nationality,
      currentCountry,
      city,
      address,
      currentDegree,
      fieldOfStudy,
      university,
      gpa,
      graduationYear,
      currentYear,
      hasTestScores,
      toeflScore,
      ieltsScore,
      greScore,
      gmatScore,
      satScore,
      targetDegree,
      targetCountries,
      targetFields,
      preferredIntake,
      budgetRange,
      financialNeed,
      fundingSource,
      expectedFunding,
      workExperience,
      researchExperience,
      publications,
      awards,
      volunteerWork,
      languages,
      personalStory,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || 
        !nationality || !currentCountry || !city || !currentDegree || 
        !fieldOfStudy || !university || !gpa || !graduationYear || 
        !currentYear || !targetDegree || !targetCountries || 
        !targetFields || !preferredIntake || !budgetRange || 
        !financialNeed || !fundingSource || !expectedFunding || !personalStory) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create scholar record
    const scholar = await prisma.scholar.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender || "Female",
        nationality,
        currentCountry,
        city,
        address: address || null,
        currentDegree,
        fieldOfStudy,
        university,
        gpa,
        graduationYear,
        currentYear,
        hasTestScores: !!hasTestScores,
        toeflScore: toeflScore || null,
        ieltsScore: ieltsScore || null,
        greScore: greScore || null,
        gmatScore: gmatScore || null,
        satScore: satScore || null,
        targetDegree,
        targetCountries,
        targetFields,
        preferredIntake,
        budgetRange,
        financialNeed,
        fundingSource,
        expectedFunding,
        workExperience: workExperience || null,
        researchExperience: researchExperience || null,
        publications: publications || null,
        awards: awards || null,
        volunteerWork: volunteerWork || null,
        languages: languages || null,
        personalStory,
        status: "APPLIED",
      },
    });

    return NextResponse.json(
      {
        message: "Scholar application received successfully",
        scholar: {
          id: scholar.id,
          email: scholar.email,
          firstName: scholar.firstName,
          lastName: scholar.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Scholar submission error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/scholars - Get all scholars (admin only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const matched = searchParams.get("matched");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (matched === "false") {
      where.assignedSponsorId = null;
    }

    const scholars = await prisma.scholar.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        sponsorships: {
          include: {
            sponsor: {
              select: {
                id: true,
                name: true,
                email: true,
                tierName: true,
                amount: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ scholars });
  } catch (error) {
    console.error("Fetch scholars error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

