/**
 * Email Scheduler
 * Handles automatic email notifications for deadlines, matches, and reminders
 */

import { prisma } from "./prisma";
import { addEmailToQueue } from "./email-service";
import { differenceInDays, isBefore, isToday, format } from "date-fns";
import { EmailType } from "@prisma/client";

/**
 * Send deadline reminder emails
 * Sends reminders at 7 days, 3 days, and 1 day before deadline
 */
export async function sendDeadlineReminders() {
  console.log("📧 Starting deadline reminder emails...");

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Find all saved scholarships with upcoming deadlines
    const savedScholarships = await prisma.savedScholarship.findMany({
      include: {
        scholarship: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            deadline: true,
            country: true,
            applicationLink: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailPreferences: {
              select: { deadlineReminders: true },
            },
          },
        },
      },
      where: {
        scholarship: {
          deadline: {
            gte: now,
            lte: sevenDaysFromNow,
          },
        },
        user: {
          emailPreferences: {
            deadlineReminders: true,
          },
        },
      },
    });

    let sentCount = 0;

    for (const saved of savedScholarships) {
      const daysLeft = differenceInDays(saved.scholarship.deadline!, now);

      // Send reminder at specific intervals (7 days, 3 days, 1 day)
      if (![7, 3, 1].includes(daysLeft)) {
        continue;
      }

      // Check if we already sent this reminder today
      const existingLog = await prisma.emailLog.findFirst({
        where: {
          userId: saved.user.id,
          email: saved.user.email,
          type: EmailType.DEADLINE_REMINDER,
          metadata: {
            path: ["scholarshipId"],
            equals: saved.scholarship.id,
          },
          sentAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1
            ),
          },
        },
      });

      if (existingLog) {
        continue; // Skip if already sent today
      }

      // Format amount
      const amount = saved.scholarship.amount
        ? `${saved.scholarship.currency} ${saved.scholarship.amount.toLocaleString()}`
        : "Amount not specified";

      // Create email content
      const subject = `⏰ ${saved.scholarship.name} - Only ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left!`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${daysLeft === 1 ? "#ff6b6b" : daysLeft === 3 ? "#ffa726" : "#ff9800"}; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">⏰ Deadline Reminder</h2>
          </div>
          
          <div style="padding: 30px 20px; background: #fff5f5;">
            <p style="font-size: 16px; color: #374151;">Hi ${saved.user.name},</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${daysLeft === 1 ? "#ff6b6b" : daysLeft === 3 ? "#ffa726" : "#ff9800"};">
              <h3 style="color: #333; margin-top: 0;">${saved.scholarship.name}</h3>
              <p style="font-size: 14px; color: #666; margin: 10px 0;">
                <strong style="color: ${daysLeft === 1 ? "#ff6b6b" : daysLeft === 3 ? "#ffa726" : "#ff9800"};">Only ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to apply!</strong>
              </p>
              <p style="font-size: 18px; color: #1A4D8F; margin: 10px 0; font-weight: bold;">
                ${amount}
              </p>
              ${saved.scholarship.country ? `<p style="font-size: 14px; color: #666; margin: 5px 0;"><strong>Location:</strong> ${saved.scholarship.country}</p>` : ""}
              <p style="font-size: 14px; color: #666; margin: 5px 0;"><strong>Deadline:</strong> ${format(saved.scholarship.deadline!, "MMMM d, yyyy")}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/scholarships/${saved.scholarship.id}" style="background: #1A4D8F; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                View & Apply Now →
              </a>
            </div>
            
            <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                💡 <strong>Pro Tip:</strong> Save this scholarship and set a reminder on your calendar to ensure you don't miss the deadline!
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              You're receiving this email because you saved this scholarship. 
              <a href="${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/email-preferences" style="color: #1A4D8F; text-decoration: none;">Update your preferences</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2025 AILES Global. Empowering African women through education.</p>
          </div>
        </div>
      `;

      // Add to queue
      await addEmailToQueue({
        userId: saved.user.id,
        email: saved.user.email,
        templateId: "deadline-reminder",
        subject,
        htmlContent,
        type: EmailType.DEADLINE_REMINDER,
        metadata: {
          scholarshipId: saved.scholarship.id,
          daysLeft,
        },
      });

      sentCount++;
      console.log(`✅ Queued deadline reminder for ${saved.user.email}: ${saved.scholarship.name}`);
    }

    console.log(`📊 Deadline reminders: ${sentCount} queued`);
    return { success: true, count: sentCount };
  } catch (error) {
    console.error("❌ Error sending deadline reminders:", error);
    throw error;
  }
}

/**
 * Send scholarship match notifications
 * Sends when new matches are found for a user
 */
export async function sendMatchNotifications() {
  console.log("📧 Starting scholarship match emails...");

  try {
    // Get recent scholarship matches (last 24 hours)
    const matches = await prisma.scholarshipMatch.findMany({
      include: {
        scholarship: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            deadline: true,
            type: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailPreferences: {
              select: { matchNotifications: true },
            },
          },
        },
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        user: {
          emailPreferences: {
            matchNotifications: true,
          },
        },
        notificationSent: false,
      },
      take: 100, // Limit to avoid overload
    });

    let sentCount = 0;

    for (const match of matches) {
      const amount = match.scholarship.amount
        ? `${match.scholarship.currency} ${match.scholarship.amount.toLocaleString()}`
        : "Amount not specified";

      const matchPercentage = Math.round(match.matchScore);

      const subject = `🎉 ${matchPercentage}% Match: ${match.scholarship.name}`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">🎉 New Scholarship Match!</h2>
            <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">${matchPercentage}% Match</p>
          </div>
          
          <div style="padding: 30px 20px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Hi ${match.user.name},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Great news! We found a new scholarship opportunity that matches your profile with a 
              <strong>${matchPercentage}% compatibility score</strong>!
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">${match.scholarship.name}</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                <div>
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Award Amount</p>
                  <p style="color: #667eea; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${amount}</p>
                </div>
                <div>
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Deadline</p>
                  <p style="color: #667eea; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${format(match.scholarship.deadline!, "MMM d")}</p>
                </div>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin: 15px 0 0 0;">
                <strong>Why this match:</strong> ${match.matchReasons || "Your profile aligns well with this opportunity"}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/scholarships/${match.scholarship.id}" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                View Details & Apply →
              </a>
            </div>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #166534; margin: 0; font-size: 14px;">
                ✅ We automatically matched you based on your profile. Update your profile to get even better matches!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2025 AILES Global. Empowering African women through education.</p>
          </div>
        </div>
      `;

      await addEmailToQueue({
        userId: match.user.id,
        email: match.user.email,
        templateId: "match-notification",
        subject,
        htmlContent,
        type: EmailType.MATCH_NOTIFICATION,
        metadata: {
          scholarshipId: match.scholarship.id,
          matchScore: match.matchScore,
        },
      });

      // Mark as sent
      await prisma.scholarshipMatch.update({
        where: { id: match.id },
        data: { notificationSent: true },
      });

      sentCount++;
      console.log(`✅ Queued match notification for ${match.user.email}: ${match.scholarship.name}`);
    }

    console.log(`📊 Match notifications: ${sentCount} queued`);
    return { success: true, count: sentCount };
  } catch (error) {
    console.error("❌ Error sending match notifications:", error);
    throw error;
  }
}

/**
 * Send application deadline reminders
 * Reminders for user's own applications
 */
export async function sendApplicationReminders() {
  console.log("📧 Starting application reminder emails...");

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Find applications with upcoming deadlines
    const applications = await prisma.application.findMany({
      include: {
        scholarship: {
          select: {
            id: true,
            name: true,
            deadline: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailPreferences: {
              select: { applicationReminders: true },
            },
          },
        },
      },
      where: {
        scholarship: {
          deadline: {
            gte: now,
            lte: sevenDaysFromNow,
          },
        },
        user: {
          emailPreferences: {
            applicationReminders: true,
          },
        },
      },
    });

    let sentCount = 0;

    for (const app of applications) {
      const daysLeft = differenceInDays(app.scholarship!.deadline!, now);

      if (![7, 3, 1].includes(daysLeft)) {
        continue;
      }

      const subject = `📝 Your application for ${app.scholarship!.name} - ${daysLeft} days left!`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3b82f6; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">📝 Application Deadline Reminder</h2>
          </div>
          
          <div style="padding: 30px 20px; background: #eff6ff;">
            <p style="font-size: 16px; color: #374151;">Hi ${app.user.name},</p>
            
            <p style="font-size: 16px; color: #374151;">
              Your application for <strong>${app.scholarship!.name}</strong> is due in <strong>${daysLeft} days</strong>!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/dashboard/applications" style="background: #3b82f6; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Complete Your Application →
              </a>
            </div>
          </div>
        </div>
      `;

      await addEmailToQueue({
        userId: app.user.id,
        email: app.user.email,
        templateId: "application-reminder",
        subject,
        htmlContent,
        type: EmailType.APPLICATION_REMINDER,
        metadata: {
          applicationId: app.id,
          scholarshipId: app.scholarshipId,
        },
      });

      sentCount++;
    }

    console.log(`📊 Application reminders: ${sentCount} queued`);
    return { success: true, count: sentCount };
  } catch (error) {
    console.error("❌ Error sending application reminders:", error);
    throw error;
  }
}

/**
 * Main scheduler function - runs all email tasks
 */
export async function runEmailScheduler() {
  console.log("\n🚀 Running email scheduler...");
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    const results = await Promise.all([
      sendDeadlineReminders(),
      sendMatchNotifications(),
      sendApplicationReminders(),
    ]);

    const totalQueued = results.reduce((sum, r) => sum + (r.count || 0), 0);
    console.log(`\n✅ Email scheduler completed. Total queued: ${totalQueued}`);

    return {
      success: true,
      results,
      totalQueued,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Email scheduler error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
