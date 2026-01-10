const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function quickTest() {
  console.log('🧪 Quick SMTP Test\n');
  
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  console.log('Config:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    pass: config.auth.pass ? '****' + config.auth.pass.slice(-4) : 'NOT SET'
  });

  const transporter = nodemailer.createTransport(config);

  try {
    console.log('\n⏳ Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!\n');

    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Test Email from Ailes',
      text: 'If you receive this, your email system works!',
      html: '<h1>Success!</h1><p>Your email system is working!</p>',
    });

    console.log('✅ Email sent!');
    console.log('Message ID:', result.messageId);
    console.log('\n🎉 Check your inbox at:', process.env.SMTP_USER);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Try:');
      console.log('   1. Generate a NEW App Password at: https://myaccount.google.com/apppasswords');
      console.log('   2. Make sure 2-Step Verification is enabled');
      console.log('   3. Use the password WITHOUT spaces');
    }
  }
}

quickTest();
