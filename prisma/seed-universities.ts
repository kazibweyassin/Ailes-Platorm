import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding universities...')

  const universities = [
    {
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      description: "Canada's leading university, consistently ranked among the world's top institutions for research and teaching excellence.",
      website: "https://www.utoronto.ca",
      ranking: 18,
      minGPA: 3.0,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 45000,
      tuitionMax: 58000,
      currency: "CAD"
    },
    {
      name: "University of British Columbia",
      country: "Canada",
      city: "Vancouver",
      description: "A global centre for research and teaching, consistently ranked among the top 40 universities in the world.",
      website: "https://www.ubc.ca",
      ranking: 35,
      minGPA: 3.0,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 42000,
      tuitionMax: 54000,
      currency: "CAD"
    },
    {
      name: "Technical University of Munich",
      country: "Germany",
      city: "Munich",
      description: "One of Europe's leading universities, renowned for excellence in engineering and technology.",
      website: "https://www.tum.de",
      ranking: 54,
      minGPA: 2.8,
      englishTest: "IELTS",
      minEnglishScore: 6.0,
      tuitionMin: 0,
      tuitionMax: 500,
      currency: "EUR"
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      description: "Australia's leading university, recognized internationally for excellence in teaching and research.",
      website: "https://www.unimelb.edu.au",
      ranking: 14,
      minGPA: 3.0,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 35000,
      tuitionMax: 45000,
      currency: "AUD"
    },
    {
      name: "University College London",
      country: "United Kingdom",
      city: "London",
      description: "London's leading multidisciplinary university, with a world-class reputation for research and teaching.",
      website: "https://www.ucl.ac.uk",
      ranking: 8,
      minGPA: 3.3,
      englishTest: "IELTS",
      minEnglishScore: 7.0,
      tuitionMin: 25000,
      tuitionMax: 35000,
      currency: "GBP"
    },
    {
      name: "University of Amsterdam",
      country: "Netherlands",
      city: "Amsterdam",
      description: "One of Europe's foremost research universities, offering a wide range of English-taught programs.",
      website: "https://www.uva.nl",
      ranking: 58,
      minGPA: 3.0,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 10000,
      tuitionMax: 18000,
      currency: "EUR"
    },
    {
      name: "National University of Singapore",
      country: "Singapore",
      city: "Singapore",
      description: "Asia's leading university, consistently ranked among the world's top universities.",
      website: "https://www.nus.edu.sg",
      ranking: 11,
      minGPA: 3.5,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 30000,
      tuitionMax: 40000,
      currency: "SGD"
    },
    {
      name: "University of Cape Town",
      country: "South Africa",
      city: "Cape Town",
      description: "Africa's leading university, offering world-class education and research opportunities.",
      website: "https://www.uct.ac.za",
      ranking: 173,
      minGPA: 2.8,
      englishTest: "IELTS",
      minEnglishScore: 6.0,
      tuitionMin: 6000,
      tuitionMax: 12000,
      currency: "USD"
    },
    {
      name: "McGill University",
      country: "Canada",
      city: "Montreal",
      description: "One of Canada's most prestigious universities, renowned for academic excellence and research.",
      website: "https://www.mcgill.ca",
      ranking: 31,
      minGPA: 3.0,
      englishTest: "IELTS",
      minEnglishScore: 6.5,
      tuitionMin: 20000,
      tuitionMax: 48000,
      currency: "CAD"
    },
    {
      name: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      description: "Switzerland's leading science and technology university, consistently ranked among the world's top universities.",
      website: "https://ethz.ch",
      ranking: 7,
      minGPA: 3.5,
      englishTest: "IELTS",
      minEnglishScore: 7.0,
      tuitionMin: 1500,
      tuitionMax: 1500,
      currency: "CHF"
    }
  ]

  for (const uni of universities) {
    const university = await prisma.university.create({
      data: uni
    })
    console.log(`Created university: ${university.name}`)
  }

  console.log('University seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
