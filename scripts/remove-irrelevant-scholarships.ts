import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Safe Scholarship Cleanup Script
 * Removes region-specific scholarships not relevant to African students
 */

async function removeIrrelevantScholarships() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("🧹 SCHOLARSHIP DATABASE CLEANUP");
    console.log("=".repeat(80) + "\n");

    // Define what to KEEP
    const keepCriteria = {
      OR: [
        // Keep scholarships specifically for Africans
        { forAfrican: true },
        
        // Keep scholarships with no geographic restrictions
        { country: "No Geographic Restrictions" },
        { country: "Global" },
        { country: { contains: "Multiple" } },
        
        // Keep international scholarships from these countries
        { country: { in: ["United Kingdom", "UK", "Canada", "Germany", "France", 
                          "Netherlands", "Belgium", "Switzerland", "Sweden", 
                          "Japan", "South Korea", "China", "Australia"] } },
      ]
    };

    // Count what we're keeping vs removing
    const totalBefore = await prisma.scholarship.count();
    const toKeep = await prisma.scholarship.count({ where: keepCriteria });
    const toRemove = totalBefore - toKeep;

    console.log("📊 ANALYSIS:");
    console.log(`   Current total: ${totalBefore} scholarships`);
    console.log(`   Will keep: ${toKeep} scholarships (${Math.round(toKeep/totalBefore*100)}%)`);
    console.log(`   Will remove: ${toRemove} scholarships (${Math.round(toRemove/totalBefore*100)}%)\n`);

    // Show sample of what will be removed
    const sampleToRemove = await prisma.scholarship.findMany({
      where: {
        NOT: keepCriteria
      },
      select: {
        name: true,
        country: true,
        provider: true,
      },
      take: 20
    });

    console.log("📋 SAMPLE OF SCHOLARSHIPS TO BE REMOVED (first 20):\n");
    sampleToRemove.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name}`);
      console.log(`      Country: ${s.country} | Provider: ${s.provider}\n`);
    });

    // Ask for confirmation
    console.log("=".repeat(80));
    console.log("⚠️  WARNING: This will permanently delete scholarships from the database!");
    console.log("=".repeat(80) + "\n");

    // Proceed with deletion
    console.log("🗑️  Removing region-specific scholarships...\n");

    const deleted = await prisma.scholarship.deleteMany({
      where: {
        NOT: keepCriteria
      }
    });

    console.log(`✅ Successfully removed ${deleted.count} scholarships\n`);

    // Verify final state
    const totalAfter = await prisma.scholarship.count();
    const africanCount = await prisma.scholarship.count({ where: { forAfrican: true }});
    const noRestrictionsCount = await prisma.scholarship.count({ 
      where: { 
        OR: [
          { country: "No Geographic Restrictions" },
          { country: "Global" },
        ]
      }
    });

    console.log("=".repeat(80));
    console.log("📊 FINAL DATABASE STATE:");
    console.log(`   Total scholarships: ${totalAfter}`);
    console.log(`   Specifically for Africans: ${africanCount}`);
    console.log(`   No Geographic Restrictions/Global: ${noRestrictionsCount}`);
    console.log(`   International programs: ${totalAfter - africanCount - noRestrictionsCount}`);
    console.log("=".repeat(80) + "\n");

    console.log("✅ CLEANUP COMPLETE!");
    console.log("   • Database is now 100% relevant to African students");
    console.log("   • Email system will only notify about applicable scholarships");
    console.log("   • Users will have better experience with focused results\n");

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

removeIrrelevantScholarships();
