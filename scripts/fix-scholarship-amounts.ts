import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixScholarshipAmounts() {
  try {
    console.log("\n🔍 Finding scholarships with missing amounts...\n");

    const missingAmounts = await prisma.scholarship.findMany({
      where: { amount: null },
      select: {
        id: true,
        name: true,
        provider: true,
        type: true,
        country: true
      },
      take: 20
    });

    console.log(`Found ${missingAmounts.length} scholarships (showing first 20):\n`);
    
    missingAmounts.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   Provider: ${s.provider}`);
      console.log(`   Type: ${s.type}`);
      console.log(`   Country: ${s.country}\n`);
    });

    // Count total with missing amounts
    const totalMissing = await prisma.scholarship.count({
      where: { amount: null }
    });

    console.log(`\n📊 Total scholarships with missing amounts: ${totalMissing}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixScholarshipAmounts();
