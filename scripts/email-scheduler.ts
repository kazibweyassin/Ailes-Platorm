import { PrismaClient } from "@prisma/client";
import {
  addEmailToQueue,
  processEmailQueue,
  getUserEmailPreferences,
} from "../lib/email-service";
import { renderTemplate } from "../lib/email-templates";
import { EmailType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Send welcome email series
 * Called when user signs up
 */
export async function sendWelcomeEmailSeries(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { emailPreferences: true },
    });

    if (!user || !user.emailPreferences?.welcomeEmails) {
      return;
    }

    // Get scholarship count for user
    const matchCount = await prisma.scholarshipMatch.count({
      where: { userId },
    });

    // Email 1: Immediate welcome
    const rendered = renderTemplate("welcome-1", {
      userName: user.name || "Friend",
      scholarshipCount: matchCount,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://ailesglobal.com",
      userId,
    });

    if (rendered) {
      await addEmailToQueue({
        userId,
        email: user.email,
        templateId: "welcome-1",
        subject: rendered.subject,
        htmlContent: rendered.htmlContent,
        type: EmailType.WELCOME,
        scheduledFor: new Date(),
      });
    }

    // Email 2: After 2 days - Tips for finding scholarships
    // Email 3: After 5 days - Success stories
    // (Add these as you expand the series)
  } catch (error) {
    console.error("Error sending welcome email series:", error);
  }
}

/**
 * Send deadline reminders for saved scholarships
 * Called periodically (e.g., daily cron job)
 */
export async function sendDeadlineReminders() {
  try {
    const now = new Date();

    // Find users with email preferences enabled
    const usersWithPreferences = await prisma.userEmailPreferences.findMany({
      where: { deadlineReminders: true, unsubscribedAt: null },
    });

    for (const prefs of usersWithPreferences) {
      const user = await prisma.user.findUnique({
        where: { id: prefs.userId },
      });

      if (!user) continue;

      // Find scholarships with deadlines in the next X days
      const remindBefore = new Date(
        now.getTime() + prefs.reminderDaysBeforeDeadline * 24 * 60 * 60 * 1000
      );

      const scholarships = await prisma.scholarship.findMany({
        where: {
          deadline: {
            gte: now,
            lte: remindBefore,
          },
          savedBy: {
            some: {
              userId: prefs.userId,
            },
          },
        },
      });

      // Send reminder for each scholarship
      for (const scholarship of scholarships) {
        const daysLeft = Math.ceil(
          (scholarship.deadline!.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const rendered = renderTemplate("deadline-reminder", {
          userName: user.name || "Friend",
          scholarshipName: scholarship.name,
          daysLeft,
          scholarshipUrl: `${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${scholarship.id}`,
          scholarshipAmount: scholarship.amount
            ? `$${scholarship.amount.toLocaleString()} ${scholarship.currency}`
            : "Amount TBA",
        });

        if (rendered) {
          await addEmailToQueue({
            userId: user.id,
            email: user.email,
            templateId: "deadline-reminder",
            subject: rendered.subject,
            htmlContent: rendered.htmlContent,
            type: EmailType.DEADLINE_REMINDER,
            scheduledFor: new Date(),
            metadata: {
              scholarshipId: scholarship.id,
              daysLeft,
            },
          });
        }
      }
    }

    console.log("Deadline reminders processed");
  } catch (error) {
    console.error("Error sending deadline reminders:", error);
  }
}

/**
 * Send weekly newsletter
 * Called once per week (e.g., Thursday morning)
 */
export async function sendWeeklyNewsletter() {
  try {
    // Get users who want newsletters
    const usersWithPreferences = await prisma.userEmailPreferences.findMany({
      where: { weeklyNewsletter: true, unsubscribedAt: null },
    });

    for (const prefs of usersWithPreferences) {
      const user = await prisma.user.findUnique({
        where: { id: prefs.userId },
        include: { scholarshipMatches: { include: { scholarship: true } } },
      });

      if (!user) continue;

      // Get top 3 new matches from this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const topMatches = await prisma.scholarshipMatch.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: weekAgo,
          },
        },
        include: { scholarship: true },
        orderBy: { matchScore: "desc" },
        take: 3,
      });

      if (topMatches.length === 0) {
        continue; // Skip users with no new matches
      }

      // Format scholarships for email
      const scholarshipsHtml = topMatches
        .map(
          (match) => `
        <div style="background: white; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea;">
          <h4 style="color: #667eea; margin: 0 0 10px 0; font-size: 16px;">
            ${match.scholarship.name}
          </h4>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
            <strong>Match Score:</strong> ${match.matchScore}%
          </p>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
            <strong>Amount:</strong> ${match.scholarship.amount ? `$${match.scholarship.amount.toLocaleString()}` : "Amount TBA"}
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${match.scholarship.id}" 
             style="color: #667eea; text-decoration: none; font-weight: bold;">
            Learn More →
          </a>
        </div>
      `
        )
        .join("");

      const rendered = renderTemplate("weekly-newsletter", {
        userName: user.name || "Friend",
        weekNumber: `Week of ${new Date().toLocaleDateString()}`,
        scholarshipCount: topMatches.length,
        topScholarships: scholarshipsHtml,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://ailesglobal.com",
      });

      if (rendered) {
        await addEmailToQueue({
          userId: user.id,
          email: user.email,
          templateId: "weekly-newsletter",
          subject: rendered.subject,
          htmlContent: rendered.htmlContent,
          type: EmailType.WEEKLY_NEWSLETTER,
          scheduledFor: new Date(),
        });
      }
    }

    console.log("Weekly newsletters scheduled");
  } catch (error) {
    console.error("Error sending weekly newsletter:", error);
  }
}

/**
 * Send email when new scholarship match is found
 * Called when AI finds a new match
 */
export async function sendScholarshipMatchEmail(
  userId: string,
  matchId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { emailPreferences: true },
    });

    if (!user || !user.emailPreferences?.matchNotifications) {
      return;
    }

    const match = await prisma.scholarshipMatch.findUnique({
      where: { id: matchId },
      include: { scholarship: true },
    });

    if (!match) return;

    // Format match reasons as HTML list
    const matchReasonsHtml = match.matchReasons
      .slice(0, 3)
      .map((reason) => `<li>${reason}</li>`)
      .join("");

    const rendered = renderTemplate("scholarship-match", {
      userName: user.name || "Friend",
      scholarshipName: match.scholarship.name,
      matchPercentage: match.matchScore,
      scholarshipUrl: `${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${match.scholarship.id}`,
      matchReasons: matchReasonsHtml,
    });

    if (rendered) {
      await addEmailToQueue({
        userId,
        email: user.email,
        templateId: "scholarship-match",
        subject: rendered.subject,
        htmlContent: rendered.htmlContent,
        type: EmailType.SCHOLARSHIP_MATCH,
        scheduledFor: new Date(),
      });
    }
  } catch (error) {
    console.error("Error sending scholarship match email:", error);
  }
}

/**
 * Send payment receipt email
 * Called after successful payment
 */
export async function sendPaymentReceiptEmail(
  userId: string,
  paymentId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { emailPreferences: true },
    });

    if (!user || !user.emailPreferences?.paymentReceipts) {
      return;
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) return;

    // Map plan to features
    const features: Record<string, string[]> = {
      premium: [
        "Unlimited scholarship matches",
        "AI-powered application assistance",
        "Weekly newsletter",
        "Email alerts",
      ],
      standard: [
        "5 university matches",
        "SOP writing assistance",
        "Application review",
        "Visa guidance",
      ],
      mentorship: [
        "Dedicated personal mentor",
        "Unlimited consultations",
        "10 university matches",
        "Complete visa assistance",
        "Interview preparation",
      ],
    };

    const planFeatures = features[payment.planId] || features.premium;

    const rendered = renderTemplate("payment-receipt", {
      userName: user.name || "Friend",
      planName: payment.planId.charAt(0).toUpperCase() + payment.planId.slice(1),
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.transactionRef,
      features: planFeatures.map((f) => `<li>${f}</li>`).join(""),
    });

    if (rendered) {
      await addEmailToQueue({
        userId,
        email: user.email,
        templateId: "payment-receipt",
        subject: rendered.subject,
        htmlContent: rendered.htmlContent,
        type: EmailType.PAYMENT_RECEIPT,
        scheduledFor: new Date(),
      });
    }
  } catch (error) {
    console.error("Error sending payment receipt email:", error);
  }
}

/**
 * Send promotional email
 */
export async function sendPromotionalEmail(
  userIds: string[],
  discount: number,
  expiresAt: Date
) {
  try {
    for (const userId of userIds) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { emailPreferences: true },
      });

      if (!user || !user.emailPreferences?.promotionalEmails) {
        continue;
      }

      const rendered = renderTemplate("promotional-50-off", {
        userName: user.name || "Friend",
        discount,
        expiresAt: expiresAt.toLocaleDateString(),
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?discount=${discount}`,
      });

      if (rendered) {
        await addEmailToQueue({
          userId,
          email: user.email,
          templateId: "promotional-50-off",
          subject: rendered.subject,
          htmlContent: rendered.htmlContent,
          type: EmailType.PROMOTIONAL,
          scheduledFor: new Date(),
        });
      }
    }

    console.log(`Promotional emails sent to ${userIds.length} users`);
  } catch (error) {
    console.error("Error sending promotional emails:", error);
  }
}

/**
 * Main scheduler function
 * Run this via cron job (e.g., every 5 minutes)
 */
export async function runEmailScheduler() {
  try {
    console.log("Running email scheduler...");

    // Process all pending emails
    const result = await processEmailQueue();
    console.log(`Processed ${result.processed} emails`);

    // Send deadline reminders (daily)
    const lastReminderCheck = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await sendDeadlineReminders();

    return { success: true, processed: result.processed };
  } catch (error) {
    console.error("Error in email scheduler:", error);
    return { success: false, error };
  }
}
