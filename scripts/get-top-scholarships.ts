import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTopScholarships() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        amount: { not: null },
      },
      orderBy: { amount: 'desc' },
      take: 20,
      select: {
        name: true,
        provider: true,
        amount: true,
        currency: true,
        deadline: true,
        country: true,
        targetCountries: true,
        degreeLevel: true,
        fieldOfStudy: true,
      },
    });
    
    console.log(JSON.stringify(scholarships, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getTopScholarships();

