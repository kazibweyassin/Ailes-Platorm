import { prisma } from './lib/prisma';

async function checkDatabase() {
  try {
    console.log('Checking database tables...\n');
    
    // Check student intakes
    const intakes = await prisma.studentIntake.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        status: true,
      },
    });
    
    console.log(`📋 Student Intakes: ${intakes.length} entries`);
    if (intakes.length > 0) {
      console.log('\nRecent submissions:');
      intakes.forEach((intake, idx) => {
        console.log(`${idx + 1}. ${intake.firstName} ${intake.lastName} (${intake.email})`);
        console.log(`   ID: ${intake.id}`);
        console.log(`   Status: ${intake.status}`);
        console.log(`   Submitted: ${intake.createdAt.toLocaleString()}\n`);
      });
    } else {
      console.log('   No student intake forms submitted yet.');
    }
    
    // Check users
    const users = await prisma.user.count();
    console.log(`\n👤 Users: ${users} entries`);
    
    // Check scholarships
    const scholarships = await prisma.scholarship.count();
    console.log(`🎓 Scholarships: ${scholarships} entries`);
    
    // Check applications
    const applications = await prisma.application.count();
    console.log(`📝 Applications: ${applications} entries`);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
