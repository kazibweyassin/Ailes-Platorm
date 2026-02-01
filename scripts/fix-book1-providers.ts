import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const extractProvider = (name: string): string => {
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
  try {
    const bookImports = await prisma.scholarship.findMany({
      where: { provider: "Book1 Import" },
      select: { id: true, name: true },
    });

    console.log(`Updating ${bookImports.length} scholarships with proper provider names...`);

    let updated = 0;
    for (const scholarship of bookImports) {
      const newProvider = extractProvider(scholarship.name);
      await prisma.scholarship.update({
        where: { id: scholarship.id },
        data: { provider: newProvider },
      });
      updated++;
      console.log(`✅ ${scholarship.name} -> ${newProvider}`);
    }

    console.log(`\n✨ Updated ${updated} scholarships`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
