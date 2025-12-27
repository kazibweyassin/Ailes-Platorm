import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/scholarships/feed - Get scholarships based on market segment
export async function POST(req: NextRequest) {
  try {
    const { marketSegment, limit = 6 } = await req.json();

    if (!marketSegment || (marketSegment !== "domestic" && marketSegment !== "international")) {
      return NextResponse.json(
        { error: "Invalid market segment. Must be 'domestic' or 'international'" },
        { status: 400 }
      );
    }

    // Build where clause based on market segment
    let where: any = {
      // Only show scholarships with upcoming deadlines or no deadline
      AND: [
        {
          OR: [
            { deadline: { gte: new Date() } },
            { deadline: null },
          ],
        },
      ],
    };

    // Filter based on market segment
    if (marketSegment === "domestic") {
      // For US students: prioritize US-based scholarships
      // Show scholarships where country is US or targetCountries includes US
      where.AND.push({
        OR: [
          { country: "United States" },
          { country: "USA" },
          { country: "US" },
          { targetCountries: { has: "United States" } },
          { targetCountries: { has: "USA" } },
          { targetCountries: { has: "US" } },
          // Also include scholarships with no country restriction (global)
          { country: null },
        ],
      });
    } else {
      // For international students: prioritize non-US scholarships or global ones
      where.AND.push({
        OR: [
          // Scholarships not targeting US
          {
            AND: [
              {
                NOT: {
                  OR: [
                    { country: "United States" },
                    { country: "USA" },
                    { country: "US" },
                  ],
                },
              },
            ],
          },
          // Scholarships with no country restriction (global)
          { country: null },
          // Scholarships for African students (common for international)
          { forAfrican: true },
        ],
      });
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      take: parseInt(limit.toString()) || 6,
      orderBy: [
        { featured: "desc" },
        { deadline: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        _count: {
          select: { applications: true, savedBy: true },
        },
      },
    });

    // Enrich with calculated fields
    const enriched = scholarships.map((s: any) => ({
      ...s,
      daysUntilDeadline: s.deadline
        ? Math.ceil(
            (new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : null,
      isUrgent: s.deadline
        ? Math.ceil(
            (new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          ) <= 30
        : false,
    }));

    return NextResponse.json(
      {
        scholarships: enriched,
        marketSegment,
        count: enriched.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Scholarship feed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

