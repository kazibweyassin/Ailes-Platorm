import { PrismaClient, ScholarshipType, DegreeLevel } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

const CSV_PATH = path.join(process.cwd(), "public", "Book1.csv");

const normalizeUrl = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
};

const parseDeadline = (raw?: string | null): Date | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  
  // Try parsing various date formats
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  
  // Try DD-Mon-YY format (e.g., "27-Feb-26")
  const dateMatch = trimmed.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2})/);
  if (dateMatch) {
    const [, day, monthStr, year] = dateMatch;
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const month = months[monthStr];
    if (month !== undefined) {
      const fullYear = 2000 + parseInt(year);
      const date = new Date(fullYear, month, parseInt(day));
      if (!Number.isNaN(date.getTime())) return date;
    }
  }
  
  return null;
};

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found: ${CSV_PATH}`);
  }

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  let added = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`📚 Importing from Book1.csv - Found ${records.length} records\n`);

  for (const row of records) {
    const name = row["Scholarship Name"]?.trim() || row["\ufeffScholarship Name"]?.trim();
    if (!name) {
      failed++;
      continue;
    }

    const existing = await prisma.scholarship.findFirst({ where: { name } });
    if (existing) {
      skipped++;
      console.log(`⏭️  Skipped: ${name} (already exists)`);
      continue;
    }

    const country = row["Host Country"]?.trim() || "Global";
    const link = normalizeUrl(row["Official Link / Apply Link"]);
    const deadline = parseDeadline(row["2026 Deadline"]);

    try {
      await prisma.scholarship.create({
        data: {
          name,
          provider: row["Focus"]?.trim() || "Book1 Import",
          country,
          amount: null,
          currency: "USD",
          type: ScholarshipType.PARTIAL,
          description: null,
          eligibility: null,
          deadline,
          applicationOpenDate: null,
          website: link,
          applicationLink: link,
          contactEmail: null,
          fieldOfStudy: ["All Fields"],
          degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
          minGPA: null,
          maxAge: null,
          minAge: null,
          forWomen: false,
          forAfrican: false,
          forUnderrepresented: false,
          targetCountries: [],
          requiresIELTS: false,
          minIELTS: null,
          requiresTOEFL: false,
          minTOEFL: null,
          requiresGRE: false,
          requiresGMAT: false,
          numberOfAwards: null,
          renewableYears: null,
          coversTuition: false,
          coversLiving: false,
          coversTravel: false,
          coversBooks: false,
          featured: false,
          verified: true,
        },
      });
      added++;
      console.log(`✅ Added: ${name}`);
    } catch (error) {
      failed++;
      console.error(`❌ Failed to add ${name}:`, error);
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Added: ${added} scholarships`);
  console.log(`   ⏭️  Skipped: ${skipped} duplicates`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📝 Total: ${records.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
