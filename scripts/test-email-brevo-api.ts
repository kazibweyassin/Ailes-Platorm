import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function sendEmailViaBrevoAPI() {
  try {
    console.log("📧 Email Test - Using Brevo REST API\n");
    console.log("=" + "=".repeat(60));

    const testEmail = "kazibweusama@gmail.com";
    const testName = "Kazib Weusama";

    // 1. Check if user exists
    console.log("\n1️⃣ Checking test user...");
    let user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: testEmail,
          name: testName,
          password: "",
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

    console.log(
      `   ✅ Found ${scholarships.length} scholarship(s):`
    );
    scholarships.forEach((s, i) => {
      const daysUntil = Math.ceil(
        (s.deadline!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(`      ${i + 1}. ${s.name} (${daysUntil} days left)`);
    });

    // 3. Create email content
    console.log("\n3️⃣ Creating email content...");

    const scholarshipList = scholarships
      .map((s) => {
        const daysUntil = Math.ceil(
          (s.deadline!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return `
        <div style="border: 1px solid #e0e0e0; padding: 20px; margin: 15px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">${s.name}</h3>
          <p style="margin: 5px 0;"><strong>Provider:</strong> ${s.provider}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${s.amount || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Deadline:</strong> ${s.deadline!.toLocaleDateString()} (in ${daysUntil} days)</p>
          <a href="${s.applicationLink || "#"}" style="
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
            <p>You received this email because you enabled deadline reminders.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`   ✅ Email content created`);

    // 4. Send via Brevo API
    console.log("\n4️⃣ Sending email via Brevo API...");

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.log("\n❌ ERROR: BREVO_API_KEY not found in environment!");
      await prisma.$disconnect();
      return;
    }

    const emailData = {
      sender: {
        name: "AILES Global",
        email: process.env.EMAIL_FROM || "info@ailesglobal.com",
      },
      to: [
        {
          email: testEmail,
          name: testName,
        },
      ],
      subject: `⏰ ${scholarships.length} Scholarship Deadline Reminder(s) - AILES Global`,
      htmlContent: htmlContent,
      replyTo: {
        email: "support@ailesglobal.com",
      },
    };

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    console.log(`   ✅ Email sent successfully!`);
    console.log(`      Message ID: ${responseData.messageId}`);
    console.log(`      To: ${testEmail}`);

    // 5. Summary
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
    console.error("\n❌ ERROR:", error instanceof Error ? error.message : error);
  } finally {
    await prisma.$disconnect();
  }
}

sendEmailViaBrevoAPI();
