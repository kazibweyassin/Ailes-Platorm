import { PrismaClient, ScholarshipType, DegreeLevel } from '@prisma/client';
import chalk from 'chalk';

const prisma = new PrismaClient();

// Popular scholarships data to addjjjjjjj
const scholarships = [
  // Commonwealth Scholarships
  {
    name: "Commonwealth Scholarship Scheme",
    provider: "Commonwealth Scholarship Commission",
    country: "Multiple Countries",
    amount: 35000,
    currency: "GBP",
    type: ScholarshipType.FULL,
    description: "The Commonwealth Scholarship Scheme awards several thousand scholarships annually to outstanding scholars from the Commonwealth to study in the UK.",
    eligibility: "Commonwealth citizens with bachelor's degree, strong academic record. No age limit.",
    deadline: new Date("2026-11-02"),
    applicationOpenDate: new Date("2026-08-01"),
    applicationLink: "https://cscuk.dfid.gov.uk/apply",
    website: "https://cscuk.dfid.gov.uk",
    contactEmail: "scholarships@cscuk.org.uk",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER, DegreeLevel.PHD],
    minGPA: 3.0,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania", "Zimbabwe"],
    requiresIELTS: true,
    minIELTS: 6.5,
    numberOfAwards: 500,
    renewableYears: 1,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },
  
  // Erasmus Mundus Scholarships
  {
    name: "Erasmus Mundus Scholarships",
    provider: "European Union",
    country: "Multiple Countries",
    amount: 24000,
    currency: "EUR",
    type: ScholarshipType.FULL,
    description: "Erasmus Mundus scholarships are awarded to students pursuing joint Masters degrees in Europe and partner countries.",
    eligibility: "Open to students from all countries. No specific GPA requirement but competitiveness required.",
    deadline: new Date("2026-01-15"),
    applicationOpenDate: new Date("2025-10-01"),
    applicationLink: "https://erasmusmundus.eu/apply",
    website: "https://erasmusmundus.eu",
    contactEmail: "info@erasmusmundus.eu",
    fieldOfStudy: ["Engineering", "Business", "Sciences", "Social Sciences"],
    degreeLevel: [DegreeLevel.MASTER],
    minGPA: 3.0,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    requiresIELTS: true,
    minIELTS: 6.5,
    numberOfAwards: 200,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Japan MEXT Scholarship
  {
    name: "MEXT Scholarship (Japan)",
    provider: "Ministry of Education, Culture, Sports, Science and Technology",
    country: "Japan",
    amount: 14500,
    currency: "JPY",
    type: ScholarshipType.FULL,
    description: "The MEXT scholarship provides an opportunity for international students to pursue undergraduate or graduate degrees at Japanese universities.",
    eligibility: "Non-Japanese nationals with good health and academic performance.",
    deadline: new Date("2026-05-09"),
    applicationOpenDate: new Date("2026-02-01"),
    applicationLink: "https://www.mext.go.jp/en/about/scholarship/",
    website: "https://www.mext.go.jp",
    contactEmail: "mext-scholarship@mext.go.jp",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
    maxAge: 35,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    numberOfAwards: 150,
    renewableYears: 4,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // South Korea Government Scholarship (KGSP)
  {
    name: "Korean Government Scholarship Program (KGSP)",
    provider: "Ministry of Education, South Korea",
    country: "South Korea",
    amount: 10800,
    currency: "KRW",
    type: ScholarshipType.FULL,
    description: "KGSP offers full scholarships to international students who wish to study undergraduate or graduate courses at Korean universities.",
    eligibility: "Non-Korean citizens under 40 years old with good academic record and health.",
    deadline: new Date("2026-03-15"),
    applicationOpenDate: new Date("2025-12-15"),
    applicationLink: "https://www.studyinkorea.go.kr/en/sub/scholarship_3_1.do",
    website: "https://www.studyinkorea.go.kr",
    contactEmail: "info@studyinkorea.go.kr",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
    maxAge: 40,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    numberOfAwards: 100,
    renewableYears: 4,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Chinese Government Scholarship
  {
    name: "Chinese Government Scholarship",
    provider: "Ministry of Education, China",
    country: "China",
    amount: 6000,
    currency: "CNY",
    type: ScholarshipType.FULL,
    description: "CGS provides scholarships for international students to pursue bachelor's, master's and doctoral degrees at designated Chinese universities.",
    eligibility: "Non-Chinese citizens with good academic performance and health condition.",
    deadline: new Date("2026-05-31"),
    applicationOpenDate: new Date("2026-03-01"),
    applicationLink: "https://www.csc.edu.cn/en/",
    website: "https://www.csc.edu.cn/en/",
    contactEmail: "info@csc.edu.cn",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD],
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    numberOfAwards: 250,
    renewableYears: 4,
    coversTuition: true,
    coversLiving: true,
    coversTravel: false,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Chevening Scholarships - UK
  {
    name: "Chevening Scholarships",
    provider: "UK Foreign, Commonwealth & Development Office",
    country: "United Kingdom",
    amount: 45000,
    currency: "GBP",
    type: ScholarshipType.FULL,
    description: "Chevening Scholarships are the UK government's global scholarship programme, funded by the FCDO and partner organizations.",
    eligibility: "Holds bachelor's degree with above-average results. At least two years of work experience. Chevening-eligible country national.",
    deadline: new Date("2026-11-02"),
    applicationOpenDate: new Date("2026-08-01"),
    applicationLink: "https://www.chevening.org/apply/",
    website: "https://www.chevening.org",
    contactEmail: "support@chevening.org",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER],
    minGPA: 3.0,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["Uganda", "Kenya", "Nigeria", "Ghana", "Ethiopia", "Tanzania"],
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

  // DAAD Scholarships - Germany
  {
    name: "DAAD Scholarships",
    provider: "German Academic Exchange Service",
    country: "Germany",
    amount: 934,
    currency: "EUR",
    type: ScholarshipType.PARTIAL,
    description: "DAAD awards scholarships to academically talented individuals to study at German higher education institutions and research institutions.",
    eligibility: "Bachelor's degree with above-average results. Proficiency in English or German.",
    deadline: new Date("2026-10-31"),
    applicationOpenDate: new Date("2026-06-01"),
    applicationLink: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    website: "https://www.daad.de",
    contactEmail: "postmaster@daad.de",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER, DegreeLevel.PHD],
    minGPA: 3.2,
    maxAge: 36,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    requiresIELTS: true,
    minIELTS: 6.0,
    numberOfAwards: 600,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Fulbright Scholarships
  {
    name: "Fulbright Scholarships",
    provider: "U.S. State Department",
    country: "United States",
    amount: 50000,
    currency: "USD",
    type: ScholarshipType.FULL,
    description: "Fulbright provides scholarships for graduate students, professionals, teachers, and artists to study or teach in the US.",
    eligibility: "Bachelor's degree, English proficiency, demonstrated leadership ability.",
    deadline: new Date("2026-08-15"),
    applicationOpenDate: new Date("2026-03-01"),
    applicationLink: "https://fulbright.state.gov/apply-abroad",
    website: "https://fulbright.state.gov",
    contactEmail: "ec-fulfellowship@state.gov",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER, DegreeLevel.PHD],
    minGPA: 3.0,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["Uganda", "Kenya", "Nigeria", "Ghana", "Ethiopia"],
    requiresIELTS: true,
    minIELTS: 7.0,
    numberOfAwards: 300,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // World Bank Scholarships
  {
    name: "World Bank Scholarships",
    provider: "World Bank",
    country: "Multiple Countries",
    amount: 0,
    currency: "USD",
    type: ScholarshipType.FULL,
    description: "The World Bank offers scholarships to students from eligible countries to pursue Master's degree studies at World Bank partner universities.",
    eligibility: "Bachelor's degree from recognized university. Work experience preferred. Strong academic record.",
    deadline: new Date("2026-04-30"),
    applicationOpenDate: new Date("2026-01-15"),
    applicationLink: "https://www.worldbank.org/en/about/partners/scholarships",
    website: "https://www.worldbank.org",
    contactEmail: "scholarships@worldbank.org",
    fieldOfStudy: ["Economics", "Business", "Development", "Environmental Studies"],
    degreeLevel: [DegreeLevel.MASTER],
    minGPA: 3.3,
    forAfrican: true,
    forWomen: true,
    forUnderrepresented: true,
    targetCountries: ["All African Countries"],
    requiresIELTS: true,
    minIELTS: 6.5,
    numberOfAwards: 80,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Mandela Rhodes Foundation
  {
    name: "Mandela Rhodes Foundation Scholarships",
    provider: "Mandela Rhodes Foundation",
    country: "South Africa",
    amount: 20000,
    currency: "ZAR",
    type: ScholarshipType.FULL,
    description: "The Mandela Rhodes Foundation Scholarships support young African leaders to pursue postgraduate studies at the University of Cape Town.",
    eligibility: "African citizens under 30 years old. Bachelor's degree. Outstanding leadership potential.",
    deadline: new Date("2026-08-31"),
    applicationOpenDate: new Date("2026-04-01"),
    applicationLink: "https://www.mandelarhodes.org/apply",
    website: "https://www.mandelarhodes.org",
    contactEmail: "apply@mandelarhodes.org",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER],
    maxAge: 30,
    forAfrican: true,
    forWomen: false,
    forUnderrepresented: false,
    targetCountries: ["All African Countries"],
    numberOfAwards: 70,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: true,
    coversTravel: true,
    coversBooks: true,
    featured: true,
    verified: true,
  },

  // Intra-Africa Scholarships
  {
    name: "Intra-Africa Scholarships",
    provider: "African Union/World Bank",
    country: "Multiple African Countries",
    amount: 5000,
    currency: "USD",
    type: ScholarshipType.PARTIAL,
    description: "Scholarships for African students to study at universities in other African countries.",
    eligibility: "African citizens with bachelor's degree. Committed to contributing to African development.",
    deadline: new Date("2026-06-30"),
    applicationOpenDate: new Date("2026-02-01"),
    applicationLink: "https://www.intrafricascholarships.org/apply",
    website: "https://www.intrafricascholarships.org",
    contactEmail: "info@intrafricascholarships.org",
    fieldOfStudy: ["All Fields"],
    degreeLevel: [DegreeLevel.MASTER],
    minGPA: 2.8,
    forAfrican: true,
    forWomen: true,
    forUnderrepresented: true,
    targetCountries: ["All African Countries"],
    numberOfAwards: 400,
    renewableYears: 2,
    coversTuition: true,
    coversLiving: false,
    coversTravel: false,
    coversBooks: true,
    featured: true,
    verified: true,
  },
];

async function main() {
  console.log(chalk.blue.bold('\n🎓 Adding Popular International Scholarships\n'));
  
  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const scholarship of scholarships) {
    try {
      // Check if exists
      const existing = await prisma.scholarship.findFirst({
        where: {
          name: {
            equals: scholarship.name,
            mode: 'insensitive'
          }
        }
      });

      if (existing) {
        console.log(chalk.yellow(`⏭️  Skipping: ${scholarship.name} (already exists)`));
        skipped++;
        continue;
      }

      // Add scholarship
      await prisma.scholarship.create({
        data: scholarship as any
      });

      console.log(chalk.green(`✅ Added: ${scholarship.name}`));
      added++;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to add ${scholarship.name}:`, error));
      failed++;
    }
  }

  console.log(chalk.blue.bold('\n📊 Summary:'));
  console.log(chalk.green(`   ✅ Added: ${added} scholarships`));
  console.log(chalk.yellow(`   ⏭️  Skipped: ${skipped} duplicates`));
  console.log(chalk.red(`   ❌ Failed: ${failed}`));
  console.log(chalk.blue(`   📝 Total: ${scholarships.length}\n`));

  await prisma.$disconnect();
}

main().catch(console.error);
