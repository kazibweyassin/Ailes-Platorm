const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testEmailSystem() {
  try {
    console.log('🧪 Testing Ailes Email System\n');
    console.log('='.repeat(50));
    
    // Step 1: Check database connection
    console.log('\n1️⃣ Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected! Found ${userCount} users`);
    
    // Step 2: Check email templates
    console.log('\n2️⃣ Checking email templates...');
    const templates = await prisma.emailTemplate.findMany();
    console.log(`✅ Found ${templates.length} email templates:`);
    templates.forEach(t => {
      console.log(`   - ${t.name} (${t.type})`);
    });
    
    // Step 3: Find or create a test user
    console.log('\n3️⃣ Finding test user...');
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('⚠️  No users found. Creating test user...');
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: new Date(),
        }
      });
      console.log('✅ Test user created!');
    } else {
      console.log(`✅ Using user: ${user.email}`);
    }
    
    // Step 4: Create email preferences
    console.log('\n4️⃣ Setting up email preferences...');
    const prefs = await prisma.userEmailPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        welcomeEmails: true,
        deadlineReminders: true,
        weeklyNewsletter: true,
        scholarshipMatches: true,
        applicationUpdates: true,
        paymentReceipts: true,
        promotionalEmails: true,
      },
      update: {
        welcomeEmails: true,
      }
    });
    console.log('✅ Email preferences configured');
    
    // Step 5: Queue a welcome email
    console.log('\n5️⃣ Queuing welcome email...');
    const welcomeTemplate = templates.find(t => t.name === 'welcome-1');
    
    if (!welcomeTemplate) {
      console.log('❌ Welcome template not found!');
      process.exit(1);
    }
    
    const queuedEmail = await prisma.emailQueue.create({
      data: {
        userId: user.id,
        email: user.email,
        templateId: welcomeTemplate.id,
        subject: welcomeTemplate.subject,
        htmlContent: welcomeTemplate.htmlContent,
        type: welcomeTemplate.type,
        status: 'PENDING',
        variables: {
          firstName: user.name?.split(' ')[0] || 'there',
          scholarshipCount: 150,
        },
        scheduledFor: new Date(),
      }
    });
    console.log('✅ Email queued successfully!');
    console.log(`   Queue ID: ${queuedEmail.id}`);
    
    // Step 6: Show queued emails
    console.log('\n6️⃣ Checking email queue...');
    const queue = await prisma.emailQueue.findMany({
      where: { status: 'PENDING' },
      include: { template: true },
      take: 5,
    });
    
    console.log(`✅ Found ${queue.length} emails in queue:`);
    queue.forEach((email, i) => {
      console.log(`   ${i + 1}. ${email.template.name} → ${email.email} (${email.status})`);
    });
    
    // Step 7: Simulate email rendering
    console.log('\n7️⃣ Simulating email content...');
    const variables = queuedEmail.variables;
    let content = welcomeTemplate.htmlContent;
    
    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    console.log('✅ Email rendered successfully!');
    console.log('\n' + '='.repeat(50));
    console.log('📧 EMAIL PREVIEW:');
    console.log('='.repeat(50));
    console.log(`To: ${queuedEmail.email}`);
    console.log(`Subject: ${welcomeTemplate.subject}`);
    console.log(`Template: ${welcomeTemplate.name}`);
    console.log('\nContent (first 500 chars):');
    console.log(content.substring(0, 500).replace(/<[^>]*>/g, ''));
    console.log('...');
    console.log('='.repeat(50));
    
    // Step 8: Summary
    console.log('\n✅ EMAIL SYSTEM TEST COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   ✓ Database: Connected`);
    console.log(`   ✓ Templates: ${templates.length} loaded`);
    console.log(`   ✓ User: ${user.email}`);
    console.log(`   ✓ Queue: ${queue.length} pending emails`);
    console.log(`   ✓ Status: READY TO SEND\n`);
    
    console.log('💡 Next Steps:');
    console.log('   1. Configure SMTP in .env.local to send real emails');
    console.log('   2. Integrate into signup: await sendWelcomeEmailSeries(userId)');
    console.log('   3. Set up cron job for automated sending');
    console.log('   4. Monitor with: npm run email:scheduler\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailSystem();
