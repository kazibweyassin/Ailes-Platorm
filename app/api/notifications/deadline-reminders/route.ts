import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDeadlineReminder } from "@/lib/email-service";

/**
 * Send deadline reminders to users
 * Should be run daily via cron job
 */
export async function POST() {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Get applications with upcoming deadlines
    const applications = await prisma.application.findMany({
      where: {
        status: { in: ['DRAFT', 'SUBMITTED'] },
        scholarship: {
          deadline: {
            gte: today,
            lte: sevenDaysFromNow,
          },
        },
      },
      include: {
        user: true,
        scholarship: true,
      },
    });

    console.log(`Found ${applications.length} applications with upcoming deadlines`);

    for (const app of applications) {
      if (!app.user.email || !app.scholarship?.deadline) continue;

      const daysLeft = Math.ceil(
        (app.scholarship.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send reminder for 7, 3, or 1 day before deadline
      if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
        await sendDeadlineReminder({
          to: app.user.email,
          userName: app.user.name || 'Student',
          scholarshipName: app.scholarship.name,
          deadline: app.scholarship.deadline.toISOString(),
          daysLeft,
          url: `${process.env.NEXTAUTH_URL}/scholarships/${app.scholarship.id}`,
        });

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: applications.length 
    });
  } catch (error: any) {
    console.error("Error sending deadline reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
