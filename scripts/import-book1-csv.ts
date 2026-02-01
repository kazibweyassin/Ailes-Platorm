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

const extractProvider = (name: string, country: string): string => {
  // Extract provider from scholarship name
  const nameToProvider: { [key: string]: string } = {
    "JJ/WBGSP": "World Bank",
    "KNB": "Indonesian Government",
    "Aga Khan": "Aga Khan Foundation",
    "SI ": "Swedish Institute",
    "Mandela Rhodes": "Mandela Rhodes Foundation",
    "CSC": "Chinese Government",
    "British Council": "British Council",
    "DAAD": "German Academic Exchange Service (DAAD)",
    "GOI-IES": "Irish Government",
    "MEXT": "Japanese Government",
    "GKS": "Korean Government",
    "Wells Mountain": "Wells Mountain Foundation",
    "UCL": "University College London",
    "GREAT": "British Council",
    "Australia Awards": "Australian Government",
    "PTDF": "Nigerian Government",
    "GSK": "GlaxoSmithKline",
    "AIMS": "AIMS South Africa",
    "Science@Leuven": "KU Leuven",
    "VLIR-UOS": "VLIR-UOS",
    "University of Geneva": "University of Geneva",
    "UAL/ISH": "University of the Arts London",
    "Beit Trust": "Beit Trust",
    "One Young World": "One Young World",
    "E-JUST": "Egypt-Japan University",
    "DW Akademie": "Deutsche Welle",
    "Schneider": "Schneider Electric",
    "CIJ": "Internews",
    "NEBOSH": "NEBOSH",
    "FirstRand": "FirstRand Foundation",
    "FAO": "Food and Agriculture Organization",
    "E4D": "ETH Zurich",
    "AUB": "American University of Beirut",
    "Fulbright": "U.S. State Department",
    "UNICEF": "United Nations",
    "Warwick": "University of Warwick",
    "Mälardalen": "Mälardalen University",
    "Kendall Ross": "Bold.org",
    "Black at Microsoft": "Microsoft",
    "Davis-Putter": "Davis-Putter Fund",
    "Great Minds": "Great Minds in STEM",
    "ANU Crawford": "Australian National University",
    "Brandeis": "Brandeis University",
    "Columbia SIPA": "Columbia University",
    "Erasmus": "Erasmus Mundus",
    "Harvard": "Harvard University",
    "IHE Delft": "UNESCO-IHE",
    "Johns Hopkins": "Johns Hopkins University",
    "Keio": "Keio University",
    "LSE": "London School of Economics",
    "GRIPS": "GRIPS",
    "Saitama": "Saitama University",
    "SOAS": "School of Oriental and African Studies",
    "Stanford": "Stanford University",
    "UC Berkeley": "University of California Berkeley",
    "Clermont-Auvergne": "Université Clermont Auvergne",
    "Félix Houphouët-Boigny": "Université Félix Houphouët-Boigny",
    "Leeds": "University of Leeds",
    "Oxford": "University of Oxford",
    "Tokyo": "University of Tokyo",
    "Tsukuba": "University of Tsukuba",
    "Williams": "Williams College",
    "Yale": "Yale University",
    "Yokohama": "Yokohama National University",
  };

  for (const [key, provider] of Object.entries(nameToProvider)) {
    if (name.includes(key)) return provider;
  }

  return name.split(/[(\-:]/).shift()?.trim() || "International Scholarship";
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
          provider: extractProvider(name, country),
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
