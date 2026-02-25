/**
 * Bulk Add Scholarships Script
 * 
 * Usage: 
 * 1. Edit the scholarships array below
 * 2. Run: npx ts-node scripts/add-scholarships-bulk.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add your scholarships here
const scholarships = [
  {
    name: "Mastercard Foundation Scholars Program",
    provider: "Mastercard Foundation",
    country: "Multiple Countries",
    amount: 50000,
    currency: "USD",
    type: "FULL",
    description: "The Mastercard Foundation Scholars Program provides comprehensive support for academically talented yet economically disadvantaged students from Africa.",
    eligibility: "African citizens with demonstrated academic talent and financial need. Must show leadership potential and commitment to giving back.",
    deadline: new Date("2026-06-30"),
    applicationOpenDate: new Date("2026-01-15"),
    website: "https://mastercardfdn.org",
    applicationLink: "https://mastercardfdn.org/apply",
    contactEmail: "scholars@mastercardfdn.org",
    fieldOfStudy: ["Business", "Engineering", "Agriculture", "Education", "Health Sciences"],
    degreeLevel: ["BACHELORS", "MASTERS", "PHD"],
    minGPA: 3.0,
    maxAge: 35,
    forWomen: false,
    forAfrican: true,
    forUnderrepresented: true,
    targetCountries: ["Uganda", "Kenya", "Ghana", "Nigeria", "Rwanda", "Senegal"],
    requiresIELTS: true,
    minIELTS: 6.5,
    numberOfAwards: 500,
    renewableYears: 4,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },
  {
    name: "Chevening Scholarships UK",
    provider: "UK Government",
    country: "United Kingdom",
    amount: 40000,
    currency: "GBP",
    type: "FULL",
    description: "Chevening Scholarships are the UK government's global scholarship programme, funded by the Foreign, Commonwealth and Development Office (FCDO).",
    eligibility: "Have an undergraduate degree. Have at least two years of work experience. Be a citizen of a Chevening-eligible country.",
    deadline: new Date("2026-11-02"),
    applicationOpenDate: new Date("2026-08-01"),
    website: "https://www.chevening.org",
    applicationLink: "https://www.chevening.org/apply",
    contactEmail: "chevening@fcdo.gov.uk",
    fieldOfStudy: ["All Fields"],
    degreeLevel: ["MASTERS"],
    minGPA: 3.0,
    forWomen: false,
    forAfrican: true,
    forUnderrepresented: false,
    targetCountries: ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania", "Zimbabwe"],
    requiresIELTS: true,
    minIELTS: 6.5,
    numberOfAwards: 1500,
    renewableYears: 1,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: false,
    featured: true,
    verified: true,
  },
  {
    name: "DAAD Scholarships Germany",
    provider: "DAAD (German Academic Exchange Service)",
    country: "Germany",
    amount: 20000,
    currency: "EUR",
    type: "FULL",
    description: "DAAD provides funding for postgraduate students and doctoral candidates to study in Germany.",
    eligibility: "Bachelor's degree with above-average results. Graduated no more than six years ago. Proficiency in English or German.",
    deadline: new Date("2026-10-31"),
    applicationOpenDate: new Date("2026-06-01"),
    website: "https://www.daad.de",
    applicationLink: "https://www.daad.de/apply",
    contactEmail: "info@daad.de",
    fieldOfStudy: ["Engineering", "Sciences", "Agriculture", "Environmental Studies"],
    degreeLevel: ["MASTERS", "PHD"],
    minGPA: 3.2,
    maxAge: 35,
    forWomen: false,
    forAfrican: true,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    requiresIELTS: true,
    minIELTS: 6.0,
    numberOfAwards: 300,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },
  
  // ADD MORE SCHOLARSHIPS BELOW - Copy the format above
  
];

async function main() {
  console.log('🚀 Starting scholarship import...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const scholarship of scholarships) {
    try {
      // Check if scholarship already exists
      const existing = await prisma.scholarship.findFirst({
        where: {
          name: scholarship.name,
          provider: scholarship.provider,
        },
      });
      
      if (existing) {
        console.log(`⚠️  Skipping "${scholarship.name}" - already exists`);
        continue;
      }
      
      // Create scholarship
      await prisma.scholarship.create({
        data: scholarship as any,
      });
      
      successCount++;
      console.log(`✅ Added: ${scholarship.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to add "${scholarship.name}":`, error);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📝 Total processed: ${scholarships.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
