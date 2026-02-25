import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function showAfricanScholarships() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("🌍 AFRICAN-FOCUSED SCHOLARSHIPS - QUALITY CHECK");
    console.log("=".repeat(80) + "\n");

    const africanScholarships = await prisma.scholarship.findMany({
      where: { forAfrican: true },
      orderBy: { amount: 'desc' },
      select: {
        name: true,
        provider: true,
        amount: true,
        currency: true,
        type: true,
        deadline: true,
        targetCountries: true,
        degreeLevel: true,
        fieldOfStudy: true,
        coversTuition: true,
        coversLiving: true,
        coversTravel: true,
        forWomen: true,
      }
    });

    console.log(`✅ Total African-Focused Scholarships: ${africanScholarships.length}\n`);

    africanScholarships.forEach((s, i) => {
      const daysLeft = s.deadline ? Math.ceil((s.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      const deadlineStr = s.deadline ? `${s.deadline.toLocaleDateString()} (${daysLeft} days)` : 'N/A';
      
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   💰 Amount: ${s.currency} $${s.amount?.toLocaleString() || 'N/A'}`);
      console.log(`   🎓 Type: ${s.type}`);
      console.log(`   🏛️  Provider: ${s.provider}`);
      console.log(`   ⏰ Deadline: ${deadlineStr}`);
      console.log(`   🎯 Degree: ${s.degreeLevel.join(', ')}`);
      console.log(`   📚 Fields: ${s.fieldOfStudy.slice(0, 3).join(', ')}${s.fieldOfStudy.length > 3 ? '...' : ''}`);
      console.log(`   🌍 Target: ${s.targetCountries.join(', ')}`);
      console.log(`   ✅ Coverage: ${[
        s.coversTuition && 'Tuition',
        s.coversLiving && 'Living',
        s.coversTravel && 'Travel'
      ].filter(Boolean).join(', ')}`);
      console.log(`   👩 Women-specific: ${s.forWomen ? '✅ YES' : 'No'}\n`);
    });

    // Statistics
    const withAmounts = africanScholarships.filter(s => s.amount !== null);
    const avgAmount = withAmounts.reduce((sum, s) => sum + (s.amount || 0), 0) / withAmounts.length;
    const fullFunding = africanScholarships.filter(s => s.type === 'FULL').length;
    const forWomen = africanScholarships.filter(s => s.forWomen).length;

    console.log("=".repeat(80));
    console.log("📊 STATISTICS:");
    console.log(`   Total: ${africanScholarships.length}`);
    console.log(`   With amount data: ${withAmounts.length} (${Math.round(withAmounts.length / africanScholarships.length * 100)}%)`);
    console.log(`   Average amount: USD $${Math.round(avgAmount).toLocaleString()}`);
    console.log(`   Full funding: ${fullFunding} (${Math.round(fullFunding / africanScholarships.length * 100)}%)`);
    console.log(`   Women-specific: ${forWomen}`);
    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

showAfricanScholarships();
