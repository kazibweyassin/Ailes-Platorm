import { PrismaClient, ScholarshipType, DegreeLevel } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

const CSV_PATH = path.join(process.cwd(), "public", "international_scholarships_cleaned.csv");

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

const parseAmount = (raw?: string | null): number | null => {
  if (!raw) return null;
  const cleaned = raw.replace(/[,]/g, " ").replace(/[^0-9.]/g, " ").trim();
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};

const inferType = (rawAmount?: string | null): ScholarshipType => {
  if (!rawAmount) return ScholarshipType.PARTIAL;
  const lower = rawAmount.toLowerCase();
  if (/(full|fully funded|100%|tuition and living)/i.test(lower)) return ScholarshipType.FULL;
  if (/(partial|tuition|stipend|grant|award)/i.test(lower)) return ScholarshipType.PARTIAL;
  return ScholarshipType.PARTIAL;
};

const parseDeadline = (raw?: string | null): Date | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;
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

  for (const row of records) {
    const name = row["Scholarship Name"]?.trim();
    if (!name) {
      failed++;
      continue;
    }

    const existing = await prisma.scholarship.findFirst({ where: { name } });
    if (existing) {
      skipped++;
      continue;
    }

    const amountRaw = row["Amount"];
    const deadlineRaw = row["Deadline"];
    const location = row["Location"]?.trim() || "Unknown";
    const link = normalizeUrl(row["Link"]);

    try {
      await prisma.scholarship.create({
        data: {
          name,
          provider: "CSV Import",
          country: location,
          amount: parseAmount(amountRaw),
          currency: "USD",
          type: inferType(amountRaw),
          description: row["Description"]?.trim() || null,
          eligibility: null,
          deadline: parseDeadline(deadlineRaw),
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
          coversTuition: inferType(amountRaw) === ScholarshipType.FULL,
          coversLiving: false,
          coversTravel: false,
          coversBooks: false,
          featured: false,
          verified: false,
        },
      });
      added++;
    } catch (error) {
      failed++;
      console.error(`Failed to add ${name}:`, error);
    }
  }

  console.log(`\nImport complete: ${added} added, ${skipped} skipped, ${failed} failed`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
