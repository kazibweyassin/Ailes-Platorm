import * as nodemailer from "nodemailer";

async function testBREVO() {
  console.log("🔍 Testing Brevo SMTP Connection\n");

  const configs = [
    {
      name: "Config 1: Account Email + SMTP Password",
      user: process.env.SMTP_USER || "your-brevo-email@domain.com",
      pass: process.env.SMTP_PASS || "your-brevo-smtp-password",
    },
    {
      name: "Config 2: Relay Address + SMTP Password",
      user: process.env.RELAY_USER || "relay-address@smtp.brevo.com",
      pass: process.env.RELAY_PASS || "your-relay-password",
    },
  ];

  for (const config of configs) {
    console.log(`\n📌 Testing: ${config.name}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Host: smtp-relay.brevo.com:587`);

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      // Test the connection
      const verified = await transporter.verify();
      if (verified) {
        console.log(`   ✅ SUCCESS - Connection verified!\n`);
        console.log(`\n🎉 USE THIS CONFIGURATION:`);
        console.log(`   SMTP_USER="${config.user}"`);
        console.log(`   SMTP_PASS="${config.pass}"`);
        process.exit(0);
      }
    } catch (error) {
      const err = error as any;
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${err.response || err.message}\n`);
    }
  }

  console.log("\n❌ All configurations failed!");
  console.log("\n💡 Troubleshooting steps:");
  console.log("1. Verify your email in Brevo (Settings → Users)");
  console.log("2. Make sure the SMTP key shows 'Active' status");
  console.log("3. Check if your Brevo account is in good standing");
  console.log("4. Try generating a NEW SMTP key again");
  process.exit(1);
}

testBREVO();
