import { prisma } from "./prisma";
import { EmailType, EmailStatus } from "@prisma/client";
import nodemailer from "nodemailer";

// Configure your email provider here
// For development, using Ethereal (fake SMTP)
// For production, use your email service (SendGrid, Resend, etc.)

const getEmailTransporter = () => {
  // TODO: Replace with your email service
  // Option 1: Use nodemailer with your SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Option 2: For development, just log emails to console
  return null;
};

export interface EmailQueueData {
  userId?: string;
  email: string;
  templateId: string;
  subject: string;
  htmlContent: string;
  type: EmailType;
  variables?: Record<string, any>;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

/**
 * Add email to queue for sending
 */
export async function addEmailToQueue(data: EmailQueueData) {
  try {
    const queue = await prisma.emailQueue.create({
      data: {
        userId: data.userId,
        email: data.email,
        templateId: data.templateId,
        subject: data.subject,
        htmlContent: data.htmlContent,
        type: data.type,
        variables: data.variables,
        scheduledFor: data.scheduledFor || new Date(),
        status: EmailStatus.PENDING,
        metadata: data.metadata,
      },
    });

    console.log(`Email queued: ${queue.id} to ${data.email}`);
    return queue;
  } catch (error) {
    console.error("Error queueing email:", error);
    throw error;
  }
}

/**
 * Send email from queue
 */
export async function sendEmailFromQueue(queueId: string) {
  try {
    const queue = await prisma.emailQueue.findUnique({
      where: { id: queueId },
      include: { template: true },
    });

    if (!queue) {
      throw new Error(`Email queue not found: ${queueId}`);
    }

    // Skip if already sent or max retries exceeded
    if (queue.status === EmailStatus.SENT) {
      return { success: true, message: "Already sent" };
    }

    if (queue.retryCount >= queue.maxRetries) {
      await prisma.emailQueue.update({
        where: { id: queueId },
        data: { status: EmailStatus.FAILED },
      });
      throw new Error(`Max retries exceeded for ${queueId}`);
    }

    // Replace variables in content
    let content = queue.htmlContent;
    if (queue.variables) {
      for (const [key, value] of Object.entries(queue.variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
      }
    }

    // Send email
    const transporter = getEmailTransporter();
    
    if (transporter) {
      // Real email sending
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@ailesglobal.com",
        to: queue.email,
        subject: queue.subject,
        html: content,
      });
    } else {
      // Development: just log
      console.log("=== EMAIL WOULD BE SENT ===");
      console.log(`To: ${queue.email}`);
      console.log(`Subject: ${queue.subject}`);
      console.log(`Type: ${queue.type}`);
      console.log("========================");
    }

    // Log the email
    await prisma.emailLog.create({
      data: {
        queueId: queueId,
        userId: queue.userId,
        email: queue.email,
        templateId: queue.templateId,
        subject: queue.subject,
        type: queue.type,
        status: EmailStatus.SENT,
        sentAt: new Date(),
      },
    });

    // Update queue status
    await prisma.emailQueue.update({
      where: { id: queueId },
      data: {
        status: EmailStatus.SENT,
        sentAt: new Date(),
      },
    });

    return { success: true, queueId };
  } catch (error) {
    console.error("Error sending email:", error);

    // Increment retry count
    await prisma.emailQueue.update({
      where: { id: queueId },
      data: {
        retryCount: {
          increment: 1,
        },
        lastError: (error instanceof Error) ? error.message : String(error),
      },
    });

    throw error;
  }
}

/**
 * Process all pending emails in queue
 */
export async function processEmailQueue() {
  try {
    const now = new Date();

    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: EmailStatus.PENDING,
        scheduledFor: {
          lte: now,
        },
      },
      take: 50, // Process 50 at a time
    });

    console.log(`Processing ${pendingEmails.length} emails from queue`);

    for (const email of pendingEmails) {
      try {
        await sendEmailFromQueue(email.id);
      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);
      }
    }

    return { processed: pendingEmails.length };
  } catch (error) {
    console.error("Error processing email queue:", error);
    throw error;
  }
}

/**
 * Create or get user email preferences
 */
export async function getUserEmailPreferences(userId: string) {
  return await prisma.userEmailPreferences.findUnique({
    where: { userId },
  });
}

/**
 * Update user email preferences
 */
export async function updateUserEmailPreferences(
  userId: string,
  data: Partial<{
    welcomeEmails: boolean;
    deadlineReminders: boolean;
    weeklyNewsletter: boolean;
    scholarshipMatches: boolean;
    applicationUpdates: boolean;
    paymentReceipts: boolean;
    promotionalEmails: boolean;
    reminderDaysBeforeDeadline: number;
    maxEmailsPerWeek: number;
  }>
) {
  return await prisma.userEmailPreferences.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
}

/**
 * Get email statistics
 */
export async function getEmailStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [sent, failed, pending, opened, clicked] = await Promise.all([
    prisma.emailLog.count({
      where: {
        status: EmailStatus.SENT,
        sentAt: { gte: since },
      },
    }),
    prisma.emailLog.count({
      where: {
        status: EmailStatus.FAILED,
        sentAt: { gte: since },
      },
    }),
    prisma.emailQueue.count({
      where: {
        status: EmailStatus.PENDING,
      },
    }),
    prisma.emailLog.count({
      where: {
        openedAt: { not: null },
        sentAt: { gte: since },
      },
    }),
    prisma.emailLog.count({
      where: {
        clickedAt: { not: null },
        sentAt: { gte: since },
      },
    }),
  ]);

  return {
    sent,
    failed,
    pending,
    opened,
    clicked,
    openRate: sent > 0 ? ((opened / sent) * 100).toFixed(2) + "%" : "0%",
    clickRate: sent > 0 ? ((clicked / sent) * 100).toFixed(2) + "%" : "0%",
  };
}

/**
 * Get user's email history
 */
export async function getUserEmailHistory(userId: string, limit = 20) {
  return await prisma.emailLog.findMany({
    where: { userId },
    include: { template: true },
    orderBy: { sentAt: "desc" },
    take: limit,
  });
}

/**
 * Unsubscribe user from all emails
 */
export async function unsubscribeUser(userId: string, reason?: string) {
  return await prisma.userEmailPreferences.update({
    where: { userId },
    data: {
      unsubscribedAt: new Date(),
      unsubscribeReason: reason,
      welcomeEmails: false,
      deadlineReminders: false,
      weeklyNewsletter: false,
      matchNotifications: false,
      applicationReminders: false,
      applicationUpdates: false,
      promotionalEmails: false,
    },
  });
}

/**
 * Re-subscribe user
 */
export async function resubscribeUser(userId: string) {
  return await prisma.userEmailPreferences.update({
    where: { userId },
    data: {
      unsubscribedAt: null,
      unsubscribeReason: null,
      welcomeEmails: true,
      deadlineReminders: true,
      weeklyNewsletter: true,
      matchNotifications: true,
      applicationReminders: true,
      applicationUpdates: true,
      paymentReceipts: true,
    },
  });
}
