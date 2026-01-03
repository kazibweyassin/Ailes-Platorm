import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Get application statistics for dashboard
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all applications with scholarship details
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const stats = {
      total: applications.length,
      draft: applications.filter((a: any) => a.status === 'DRAFT').length,
      submitted: applications.filter((a: any) => a.status === 'SUBMITTED').length,
      underReview: applications.filter((a: any) => a.status === 'UNDER_REVIEW').length,
      accepted: applications.filter((a: any) => a.status === 'ACCEPTED').length,
      rejected: applications.filter((a: any) => a.status === 'REJECTED').length,
      
      // Upcoming deadlines (next 30 days)
      upcomingDeadlines: applications.filter((a: any) => {
        if (!a.scholarship?.deadline) return false;
        const deadline = new Date(a.scholarship.deadline);
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return deadline > now && deadline <= thirtyDaysFromNow;
      }).length,
      
      // Success rate
      successRate: applications.length > 0
        ? Math.round((applications.filter((a: any) => a.status === 'ACCEPTED').length / applications.length) * 100)
        : 0,
    };

    // Recent applications (last 5)
    const recentApplications = applications.slice(0, 5).map((app: any) => ({
      id: app.id,
      scholarshipName: app.scholarship?.name || app.programName || 'Unknown',
      provider: app.scholarship?.provider,
      status: app.status,
      appliedAt: app.submittedAt || app.createdAt,
      deadline: app.scholarship?.deadline,
    }));

    return NextResponse.json({
      stats,
      recentApplications,
    });
  } catch (error: any) {
    console.error("Error fetching application stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
