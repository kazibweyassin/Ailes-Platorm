const { PrismaClient, EmailStatus } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

// Email transporter
function getTransporter() {
  if (!process.env.SMTP_HOST) {
    console.log('⚠️  SMTP not configured - emails will be logged only');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function processQueue() {
  console.log(`\n[${new Date().toISOString()}] 📧 Processing email queue...\n`);

  try {
    // Get pending emails
    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: 'PENDING',
        scheduledFor: {
          lte: new Date(),
        },
        retryCount: {
          lt: 3, // Max retries
        },
      },
      take: 50, // Process 50 at a time
      include: {
        template: true,
      },
    });

    if (pendingEmails.length === 0) {
      console.log('✅ No pending emails in queue\n');
      return { processed: 0, sent: 0, failed: 0 };
    }

    console.log(`Found ${pendingEmails.length} emails to send\n`);

    const transporter = getTransporter();
    let sent = 0;
    let failed = 0;

    for (const email of pendingEmails) {
      console.log(`\n📤 Processing: ${email.template.name} → ${email.email}`);
      
      try {
        // Render email content with variables
        let htmlContent = email.htmlContent;
        let subject = email.subject;

        if (email.variables) {
          console.log('   Variables:', email.variables);
          Object.entries(email.variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, value);
            subject = subject.replace(regex, value);
          });
        }

        if (transporter) {
          // Send real email
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to: email.email,
            subject: subject,
            html: htmlContent,
            replyTo: process.env.EMAIL_REPLY_TO,
          });

          console.log(`✅ Sent: ${email.template.name} → ${email.email}`);
        } else {
          // Console mode
          console.log(`📧 [CONSOLE MODE] ${email.template.name} → ${email.email}`);
          console.log(`   Subject: ${subject}`);
        }

        // Update status
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // Log success
        await prisma.emailLog.create({
          data: {
            userId: email.userId,
            email: email.email,
            templateId: email.templateId,
            subject: subject,
            status: 'DELIVERED',
            sentAt: new Date(),
          },
        });

        sent++;
      } catch (error) {
        console.error(`❌ Failed: ${email.email}`);
        console.error(`   Error: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);

        // Update retry count
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            retryCount: email.retryCount + 1,
            lastError: error.message,
            status: email.retryCount >= 2 ? 'FAILED' : 'PENDING',
          },
        });

        // Log failure
        await prisma.emailLog.create({
          data: {
            userId: email.userId,
            email: email.email,
            templateId: email.templateId,
            subject: email.subject,
            status: 'FAILED',
            sentAt: new Date(),
          },
        });

        failed++;
      }
    }

    console.log(`\n📊 Results: ${sent} sent, ${failed} failed\n`);

    return { processed: pendingEmails.length, sent, failed };
  } catch (error) {
    console.error('❌ Queue processing error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run it
processQueue()
  .then(result => {
    console.log('✅ Email scheduler completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Email scheduler failed:', error);
    process.exit(1);
  });
