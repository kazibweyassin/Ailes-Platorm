import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendScholarshipAlert } from "@/lib/email-service";

/**
 * Send scholarship alerts to users
 * Can be triggered manually or via cron job
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Optional: Add authentication for admin/cron jobs
    // For now, anyone can trigger (you can add API key auth later)
    
    const { userId } = await req.json();

    // If specific user, send only to them
    if (userId) {
      await sendAlertsToUser(userId);
      return NextResponse.json({ success: true, message: 'Alert sent' });
    }

    // Otherwise, send to all users with matching scholarships
    await sendAlertsToAllUsers();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Alerts sent to all users' 
    });
  } catch (error: any) {
    console.error("Error sending alerts:", error);
    return NextResponse.json(
      { error: "Failed to send alerts" },
      { status: 500 }
    );
  }
}

async function sendAlertsToUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.email) return;

  // Find matching scholarships from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const scholarships = await prisma.scholarship.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      deadline: { gte: new Date() },
      ...(user.fieldOfStudy && {
        fieldOfStudy: { has: user.fieldOfStudy }
      }),
      ...(user.degreeLevel && {
        degreeLevel: { has: user.degreeLevel }
      }),
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  if (scholarships.length === 0) return;

  await sendScholarshipAlert({
    to: user.email,
    userName: user.name || 'Student',
    scholarships: scholarships.map((s: any) => ({
      name: s.name,
      provider: s.provider,
      amount: s.amount || 0,
      currency: s.currency,
      deadline: s.deadline?.toISOString() || new Date().toISOString(),
      url: `${process.env.NEXTAUTH_URL}/scholarships/${s.id}`,
    })),
  });
}

async function sendAlertsToAllUsers() {
  // Get all users who want alerts (you can add a preference field)
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      // Add: emailPreferences: { scholarshipAlerts: true }
    },
    select: {
      id: true,
      email: true,
      name: true,
      fieldOfStudy: true,
      degreeLevel: true,
    },
  });

  console.log(`Sending alerts to ${users.length} users...`);

  for (const user of users) {
    if (user.email) {
      await sendAlertsToUser(user.id);
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
