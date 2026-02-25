import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function analyzeRemovalImpact() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("📊 SCHOLARSHIP REMOVAL IMPACT ANALYSIS");
    console.log("=".repeat(80) + "\n");

    // Current totals
    const total = await prisma.scholarship.count();
    const forAfrican = await prisma.scholarship.count({ where: { forAfrican: true }});
    const noRestrictions = await prisma.scholarship.count({ 
      where: { 
        OR: [
          { country: "No Geographic Restrictions" },
          { country: "Global" },
          { country: { contains: "Multiple" }},
        ]
      }
    });

    console.log("📚 CURRENT STATE:");
    console.log(`   Total scholarships: ${total}`);
    console.log(`   Specifically for Africans: ${forAfrican}`);
    console.log(`   No Geographic Restrictions/Global: ${noRestrictions}`);
    console.log(`   Region-specific (would be removed): ${total - forAfrican - noRestrictions}\n`);

    // What would remain
    const wouldRemain = forAfrican + noRestrictions;
    console.log("✅ IF WE KEEP:");
    console.log(`   1. Specifically for Africans (forAfrican=true): ${forAfrican}`);
    console.log(`   2. No Geographic Restrictions/Global: ${noRestrictions}`);
    console.log(`   → TOTAL REMAINING: ${wouldRemain} scholarships\n`);

    // What would be removed
    const usOnly = await prisma.scholarship.count({
      where: { 
        AND: [
          { forAfrican: false },
          { 
            country: { 
              in: ["United States", "USA", "California", "Texas", "New York", 
                   "South Carolina", "Tennessee", "Kansas", "Oklahoma", 
                   "Massachusetts", "Alabama", "Florida", "Georgia", "Illinois"]
            }
          }
        ]
      }
    });

    console.log("❌ WOULD BE REMOVED:");
    console.log(`   US-state specific: ${usOnly}`);
    console.log(`   Other region-specific: ${total - wouldRemain - usOnly}\n`);

    // Check quality of what would remain
    const remainingWithAmounts = await prisma.scholarship.count({
      where: {
        OR: [
          { forAfrican: true },
          { country: "No Geographic Restrictions" },
          { country: "Global" },
        ],
        amount: { not: null }
      }
    });

    const remainingWithDeadlines = await prisma.scholarship.count({
      where: {
        OR: [
          { forAfrican: true },
          { country: "No Geographic Restrictions" },
          { country: "Global" },
        ],
        deadline: { not: null }
      }
    });

    console.log("🎯 QUALITY OF REMAINING SCHOLARSHIPS:");
    console.log(`   With amount data: ${remainingWithAmounts}/${wouldRemain} (${Math.round(remainingWithAmounts/wouldRemain*100)}%)`);
    console.log(`   With deadlines: ${remainingWithDeadlines}/${wouldRemain} (${Math.round(remainingWithDeadlines/wouldRemain*100)}%)\n`);

    // Strategic recommendation
    console.log("=".repeat(80));
    console.log("💡 RECOMMENDATION:\n");
    console.log("✅ KEEP THESE (Relevant to Africans):");
    console.log("   • Scholarships specifically for Africans (21)");
    console.log("   • 'No Geographic Restrictions' scholarships (783)");
    console.log("   • 'Global' scholarships (13)");
    console.log(`   → TOTAL: ~${wouldRemain} scholarships\n`);
    
    console.log("❌ REMOVE THESE (Not relevant to Africans):");
    console.log("   • US state-specific (California, Texas, etc.)");
    console.log("   • Other region-specific (unless explicitly open to internationals)");
    console.log(`   → Would remove: ~${total - wouldRemain} scholarships\n`);

    console.log("📈 RESULT:");
    console.log("   • Focused, relevant database for African students");
    console.log("   • Better user experience (only relevant scholarships)");
    console.log("   • More efficient email system (no spam)");
    console.log("   • Quality over quantity ✅");
    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeRemovalImpact();
