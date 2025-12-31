import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNewUsers() {
  console.log('🔍 Checking for new users...\n');

  try {
    // Get all users ordered by creation date
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        country: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`👤 Total Users: ${allUsers.length}\n`);

    // Filter out test users (emails containing 'test' or 'example.com')
    const realUsers = allUsers.filter(user => 
      !user.email.toLowerCase().includes('test') && 
      !user.email.includes('example.com')
    );

    console.log(`✅ Real Users: ${realUsers.length}`);
    console.log(`🧪 Test Users: ${allUsers.length - realUsers.length}\n`);

    // Show users from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = allUsers.filter(user => 
      new Date(user.createdAt) >= sevenDaysAgo
    );

    console.log(`📅 Users created in last 7 days: ${recentUsers.length}\n`);

    if (realUsers.length > 0) {
      console.log('✅ REAL USERS:');
      console.log('─'.repeat(80));
      realUsers.forEach((user, index) => {
        const createdDate = new Date(user.createdAt);
        const isRecent = createdDate >= sevenDaysAgo;
        const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log(`${index + 1}. ${user.name || 'No Name'} (${user.email})`);
        console.log(`   Role: ${user.role} | Country: ${user.country || 'Not set'}`);
        console.log(`   Created: ${createdDate.toLocaleString()} ${isRecent ? `🆕 (${daysAgo} days ago)` : ''}`);
        console.log('');
      });
    }

    if (recentUsers.length > 0) {
      console.log('🆕 RECENT USERS (Last 7 Days):');
      console.log('─'.repeat(80));
      recentUsers.forEach((user, index) => {
        const createdDate = new Date(user.createdAt);
        const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const isReal = !user.email.toLowerCase().includes('test') && !user.email.includes('example.com');
        
        console.log(`${index + 1}. ${user.name || 'No Name'} (${user.email}) ${isReal ? '✅' : '🧪'}`);
        console.log(`   Role: ${user.role} | Created: ${createdDate.toLocaleString()} (${daysAgo} days ago)`);
        console.log('');
      });
    }

    if (realUsers.length === 0) {
      console.log('⚠️  No real users found. All users appear to be test accounts.');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNewUsers();

