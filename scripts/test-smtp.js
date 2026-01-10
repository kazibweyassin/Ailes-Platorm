const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testSMTP() {
  console.log('🧪 Testing SMTP configuration...\n');
  
  console.log('Configuration:');
  console.log('- Host:', process.env.SMTP_HOST);
  console.log('- Port:', process.env.SMTP_PORT);
  console.log('- User:', process.env.SMTP_USER);
  console.log('- Password:', process.env.SMTP_PASSWORD ? '****' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
  console.log();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself
      subject: '🎉 Ailes Email System Test - Success!',
      text: 'Congratulations! Your email system is working correctly.\n\nThis is a test email from Ailes Global platform.\n\nYour email automation is now ready to generate revenue!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">🎉 Success!</h1>
          <p>Congratulations! Your email system is working correctly.</p>
          <p>This is a test email from <strong>Ailes Global</strong> platform.</p>
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
            <strong>✅ Your email automation is now ready to generate revenue!</strong>
          </div>
          <h2>What's Next?</h2>
          <ol>
            <li>Integrate emails into signup flow</li>
            <li>Add payment receipt emails</li>
            <li>Set up cron jobs for automation</li>
            <li>Monitor conversion rates</li>
          </ol>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Sent from Ailes Global Email System
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎯 Check your inbox:', process.env.SMTP_USER);
    console.log('\n💡 If you don\'t see it:');
    console.log('   - Check your spam/junk folder');
    console.log('   - Wait 1-2 minutes for delivery');
    console.log('   - Check the email address is correct\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   1. Your Gmail address is correct');
      console.log('   2. You\'re using an App Password (not your regular password)');
      console.log('   3. 2-Step Verification is enabled on your Google Account');
      console.log('   4. Generate a new App Password at: https://myaccount.google.com/apppasswords\n');
    }
    process.exit(1);
  }
}

testSMTP();
