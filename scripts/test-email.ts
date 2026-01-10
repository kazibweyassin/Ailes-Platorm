import { PrismaClient } from "@prisma/client";
import { sendWelcomeEmailSeries } from "./email-scheduler";

const prisma = new PrismaClient();

async function testEmail() {
  try {
    console.log("🧪 Testing email system...");

    // Find a user to test with
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log("❌ No users found. Create a user first.");
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.email}`);

    // Send welcome email
    await sendWelcomeEmailSeries(user.id);

    console.log("✓ Welcome email queued!");

    // Check the queue
    const queuedEmails = await prisma.emailQueue.findMany({
      where: { userId: user.id },
      include: { template: true },
    });

    console.log(`\n📧 Queued emails (${queuedEmails.length}):`);
    queuedEmails.forEach((email) => {
      console.log(`  - ${email.template.name}: ${email.status}`);
    });

    console.log("\n✅ Email system is working!");
    console.log(
      "💡 To send emails, run: npm run email:scheduler or set up cron job"
    );
  } catch (error) {
    console.error("❌ Error testing email:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testEmail();
