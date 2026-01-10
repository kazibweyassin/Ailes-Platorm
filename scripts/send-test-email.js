const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function sendTestEmail() {
  try {
    console.log('📧 Queuing test email to kazibweusama@gmail.com...\n');

    // Get welcome template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: 'welcome-1' }
    });

    if (!template) {
      console.error('❌ Welcome template not found!');
      process.exit(1);
    }

    // Get scholarship count
    const scholarshipCount = await prisma.scholarship.count();

    // Queue email
    const queued = await prisma.emailQueue.create({
      data: {
        email: 'kazibweusama@gmail.com',
        templateId: template.id,
        subject: template.subject,
        htmlContent: template.htmlContent,
        type: template.type,
        status: 'PENDING',
        variables: {
          firstName: 'Kazi',
          scholarshipCount: scholarshipCount.toString(),
        },
        scheduledFor: new Date(),
      }
    });

    console.log('✅ Email queued successfully!');
    console.log('   ID:', queued.id);
    console.log('   To:', queued.email);
    console.log('   Template:', template.name);
    console.log('   Subject:', template.subject);
    console.log('\n📤 Now sending...\n');

    // Now process it immediately
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Render content
    let htmlContent = template.htmlContent;
    let subject = template.subject;
    
    Object.entries(queued.variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, value);
      subject = subject.replace(regex, value);
    });

    // Send email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: queued.email,
      subject: subject,
      html: htmlContent,
      replyTo: process.env.EMAIL_REPLY_TO,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.messageId);

    // Update queue status
    await prisma.emailQueue.update({
      where: { id: queued.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    // Log it
    await prisma.emailLog.create({
      data: {
        email: queued.email,
        templateId: template.id,
        subject: subject,
        status: 'DELIVERED',
        sentAt: new Date(),
      }
    });

    console.log('\n🎉 SUCCESS! Check your inbox at kazibweusama@gmail.com\n');
    console.log('📬 The email includes:');
    console.log('   - Personalized greeting for "Kazi"');
    console.log(`   - ${scholarshipCount} scholarships available`);
    console.log('   - Professional welcome message');
    console.log('   - Call-to-action buttons\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

sendTestEmail();
