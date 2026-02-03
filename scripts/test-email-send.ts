import { PrismaClient } from "@prisma/client";
import * as nodemailer from "nodemailer";

const prisma = new PrismaClient();

async function testEmailSend() {
  try {
    console.log("📧 Email Test - Sending Real Email\n");
    console.log("=" + "=".repeat(60));

    const testEmail = "kazibweusama@gmail.com";
    const testName = "Kazib Weusama";

    // 1. Check if user exists, if not create one
    console.log("\n1️⃣ Checking/Creating test user...");
    let user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: testEmail,
          name: testName,
          password: "", // OAuth user
        },
      });
      console.log(`   ✅ Created user: ${testEmail}`);
    } else {
      console.log(`   ✅ User exists: ${testEmail}`);
    }

    // 2. Find scholarships with upcoming deadlines
    console.log("\n2️⃣ Finding scholarships with upcoming deadlines...");
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date(),
          lte: thirtyDaysFromNow,
        },
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        amount: true,
        provider: true,
        applicationLink: true,
      },
      take: 3,
    });

    if (scholarships.length === 0) {
      console.log("   ⚠️  No scholarships with upcoming deadlines found!");
      console.log(
        "   Creating a test scholarship with deadline in 5 days..."
      );

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);

      const testScholarship = await prisma.scholarship.create({
        data: {
          name: "Test Scholarship - Upcoming Deadline",
          provider: "Test Organization",
          type: "FULL",
          amount: 5000,
          currency: "USD",
          deadline: deadline,
          description: "This is a test scholarship for email testing",
          applicationLink: "https://example.com/apply",
          forAfrican: true,
          targetCountries: ["Kenya", "Uganda", "Tanzania"],
        },
      });

      scholarships.push({
        id: testScholarship.id,
        name: testScholarship.name,
        deadline: testScholarship.deadline,
        amount: testScholarship.amount,
        provider: testScholarship.provider,
        applicationLink: testScholarship.applicationLink,
      });
    }

    console.log(
      `   ✅ Found ${scholarships.length} scholarship(s) with upcoming deadline(s):`
    );
    scholarships.forEach((s, i) => {
      const daysUntil = Math.ceil(
        (s.deadline!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(
        `      ${i + 1}. ${s.name} (${daysUntil} days left, $${s.amount})`
      );
    });

    // 3. Add scholarships to user's saved list
    console.log("\n3️⃣ Adding scholarships to user's saved list...");
    for (const scholarship of scholarships) {
      const existing = await prisma.savedScholarship.findUnique({
        where: {
          userId_scholarshipId: {
            userId: user.id,
            scholarshipId: scholarship.id,
          },
        },
      });

      if (!existing) {
        await prisma.savedScholarship.create({
          data: {
            userId: user.id,
            scholarshipId: scholarship.id,
          },
        });
        console.log(`   ✅ Saved: ${scholarship.name}`);
      } else {
        console.log(`   ℹ️  Already saved: ${scholarship.name}`);
      }
    }

    // 4. Ensure user has email preferences enabled
    console.log("\n4️⃣ Enabling email preferences...");
    await prisma.userEmailPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        deadlineReminders: true,
        matchNotifications: true,
        applicationReminders: true,
      },
      update: {
        deadlineReminders: true,
        matchNotifications: true,
        applicationReminders: true,
      },
    });
    console.log(`   ✅ Email preferences enabled for ${testEmail}`);

    // 5. Set up email and send
    console.log("\n5️⃣ Setting up email service...");

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("\n❌ ERROR: Email configuration missing!");
      console.log("\nPlease add to .env file:");
      console.log("  SMTP_HOST=smtp-relay.brevo.com");
      console.log("  SMTP_PORT=587");
      console.log("  SMTP_USER=9ad7fa001@smtp.brevo.com");
      console.log("  SMTP_PASS=your-brevo-smtp-password");
      console.log("\nGet credentials from: https://www.brevo.com/");
      await prisma.$disconnect();
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      requireTLS: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    console.log(`   ✅ Email transporter configured`);
    console.log(`      Host: ${smtpHost}:${smtpPort}`);
    console.log(`      User: ${smtpUser}`);

    // 6. Create and send email
    console.log("\n6️⃣ Creating email content...");

    const scholarshipList = scholarships
      .map((s) => {
        const daysUntil = Math.ceil(
          (s.deadline!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return `
        <div style="border: 1px solid #e0e0e0; padding: 20px; margin: 15px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">${s.name}</h3>
          <p style="margin: 5px 0;"><strong>Provider:</strong> ${s.provider}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${s.amount}</p>
          <p style="margin: 5px 0;"><strong>Deadline:</strong> ${s.deadline!.toLocaleDateString()} (in ${daysUntil} days)</p>
          <a href="${s.applicationLink}" style="
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          ">Apply Now</a>
        </div>`;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; border-radius: 8px; }
          .header h1 { margin: 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Scholarship Deadline Reminders</h1>
            <p>Hi ${testName}!</p>
          </div>
          
          <p>We found ${scholarships.length} scholarship(s) with upcoming deadlines that match your profile:</p>
          
          ${scholarshipList}
          
          <p style="margin-top: 30px;">
            <a href="https://www.ailesglobal.com/scholarships" style="
              display: inline-block;
              padding: 12px 30px;
              background-color: #1976d2;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            ">View All Scholarships</a>
          </p>
          
          <div class="footer">
            <p>AILES Global - Scholarship Matching Platform</p>
            <p>You received this email because you enabled deadline reminders in your preferences.</p>
            <p><a href="https://www.ailesglobal.com/preferences" style="color: #1976d2;">Manage preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`   ✅ Email content created`);

    console.log("\n7️⃣ Sending email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || smtpUser,
      to: testEmail,
      subject: `⏰ ${scholarships.length} Scholarship Deadline Reminder(s) - AILES Global`,
      html: htmlContent,
    });

    console.log(`   ✅ Email sent successfully!`);
    console.log(`      Message ID: ${info.messageId}`);
    console.log(`      To: ${testEmail}`);
    console.log(`      Subject: ${scholarships.length} Scholarship Deadline Reminder(s)`);

    // 8. Summary
    console.log("\n" + "=".repeat(61));
    console.log("✅ EMAIL TEST COMPLETED SUCCESSFULLY!\n");
    console.log(`📧 Email sent to: ${testEmail}`);
    console.log(`📚 Scholarships included: ${scholarships.length}`);
    console.log(
      `⏰ Upcoming deadline: ${scholarships[0].deadline!.toLocaleDateString()}`
    );
    console.log("\nCheck your email inbox in a few moments!");
    console.log("=" + "=".repeat(60));
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    if (
      error instanceof Error &&
      error.message.includes("Invalid login")
    ) {
      console.log("\n⚠️  SMTP Authentication failed!");
      console.log("Please verify your Brevo credentials are correct.");
      console.log("Get them from: https://www.brevo.com/ → Settings → SMTP");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testEmailSend();
