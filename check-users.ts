import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'],
});

async function checkUsers() {
  console.log('Checking users in database...\n');

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`👤 Total Users: ${users.length}\n`);

    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No Name'} (${user.email})`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}\n`);
      });
    } else {
      console.log('No users found in database.');
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
