import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const total = await prisma.scholarship.count();
    const unique = await prisma.scholarship.groupBy({
      by: ["name"],
      _count: true,
    });
    const duplicates = unique.filter((u) => u._count > 1);

    console.log(`Total scholarships: ${total}`);
    console.log(`Unique names: ${unique.length}`);
    console.log(`Duplicates: ${duplicates.length}`);

    if (duplicates.length > 0) {
      console.log("\nDuplicate scholarships:");
      duplicates.slice(0, 10).forEach((d) => console.log(`  - ${d.name} (${d._count}x)`));
    }

    const bookImports = await prisma.scholarship.count({
      where: { provider: "Book1 Import" },
    });
    console.log(`\nBook1 Import scholarships: ${bookImports}`);

    // Show some Book1 Import scholarships
    if (bookImports > 0) {
      const samples = await prisma.scholarship.findMany({
        where: { provider: "Book1 Import" },
        select: { name: true, provider: true },
        take: 5,
      });
      console.log("\nSample Book1 Import scholarships:");
      samples.forEach((s) => console.log(`  - ${s.name}`));
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
