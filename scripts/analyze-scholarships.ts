import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function analyzeScholarships() {
  try {
    console.log("\n" + "=".repeat(70));
    console.log("📚 SCHOLARSHIP DATABASE ANALYSIS");
    console.log("=".repeat(70));

    // Get total count
    const total = await prisma.scholarship.count();
    console.log(`\n✅ TOTAL SCHOLARSHIPS: ${total}`);

    // Get breakdown by country (top 15)
    const byCountry = await prisma.scholarship.groupBy({
      by: ['country'],
      _count: true,
      orderBy: { _count: { country: 'desc' } },
      take: 15
    });

    console.log("\n🌍 TOP 15 COUNTRIES:");
    byCountry.forEach((item: any) => {
      console.log(`   ${item.country?.padEnd(25)} → ${item._count} scholarships`);
    });

    // Get breakdown by type
    const byType = await prisma.scholarship.groupBy({
      by: ['type'],
      _count: true,
      orderBy: { _count: { type: 'desc' } }
    });

    console.log("\n💰 BY SCHOLARSHIP TYPE:");
    byType.forEach((item: any) => {
      console.log(`   ${item.type?.padEnd(15)} → ${item._count} scholarships`);
    });

    // Check African scholarships
    const forAfrican = await prisma.scholarship.count({
      where: { forAfrican: true }
    });

    const forWomen = await prisma.scholarship.count({
      where: { forWomen: true }
    });

    console.log("\n👥 TARGET AUDIENCE:");
    console.log(`   For African Students → ${forAfrican} scholarships`);
    console.log(`   For Women           → ${forWomen} scholarships`);

    // Get upcoming deadlines (next 60 days)
    const upcoming = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date(),
          lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        name: true,
        provider: true,
        deadline: true,
        amount: true,
        currency: true,
        country: true
      },
      orderBy: { deadline: 'asc' },
      take: 15
    });

    console.log(`\n⏰ UPCOMING DEADLINES (Next 60 days): ${upcoming.length} scholarships`);
    if (upcoming.length > 0) {
      upcoming.forEach((s: any, i: number) => {
        const daysLeft = Math.ceil((s.deadline!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const amount = s.amount ? `${s.currency} $${s.amount.toLocaleString()}` : 'Amount N/A';
        console.log(`\n   ${i + 1}. ${s.name}`);
        console.log(`      Provider: ${s.provider}`);
        console.log(`      Amount: ${amount}`);
        console.log(`      Country: ${s.country}`);
        console.log(`      ⏰ Deadline: ${s.deadline.toLocaleDateString()} (${daysLeft} days left)`);
      });
    } else {
      console.log("   No deadlines in the next 60 days");
    }

    // Get top providers
    const topProviders = await prisma.scholarship.groupBy({
      by: ['provider'],
      _count: true,
      orderBy: { _count: { provider: 'desc' } },
      take: 10
    });

    console.log("\n🏛️  TOP 10 PROVIDERS:");
    topProviders.forEach((item: any, i: number) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${item.provider?.padEnd(40)} → ${item._count} scholarships`);
    });

    // Sample scholarships
    const samples = await prisma.scholarship.findMany({
      select: {
        name: true,
        provider: true,
        amount: true,
        currency: true,
        type: true,
        country: true,
        deadline: true,
        forAfrican: true,
        forWomen: true,
        degreeLevel: true,
        fieldOfStudy: true
      },
      take: 5
    });

    console.log("\n📋 SAMPLE SCHOLARSHIPS (First 5):");
    samples.forEach((s: any, i: number) => {
      console.log(`\n   ${i + 1}. ${s.name}`);
      console.log(`      Provider: ${s.provider}`);
      console.log(`      Type: ${s.type}`);
      console.log(`      Amount: ${s.amount ? `${s.currency} $${s.amount.toLocaleString()}` : 'N/A'}`);
      console.log(`      Country: ${s.country}`);
      console.log(`      Degree Levels: ${s.degreeLevel.join(', ')}`);
      if (s.fieldOfStudy && s.fieldOfStudy.length > 0) {
        console.log(`      Fields: ${s.fieldOfStudy.slice(0, 3).join(', ')}${s.fieldOfStudy.length > 3 ? '...' : ''}`);
      }
      console.log(`      For African: ${s.forAfrican ? '✅ Yes' : 'No'}`);
      console.log(`      For Women: ${s.forWomen ? '✅ Yes' : 'No'}`);
      if (s.deadline) {
        const daysLeft = Math.ceil((s.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        console.log(`      Deadline: ${s.deadline.toLocaleDateString()} (${daysLeft > 0 ? daysLeft + ' days left' : 'expired'})`);
      }
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ ANALYSIS COMPLETE");
    console.log("=".repeat(70) + "\n");

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeScholarships();
