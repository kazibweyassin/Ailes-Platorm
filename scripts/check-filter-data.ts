import { prisma } from '../lib/prisma';

async function checkData() {
  // Check total scholarships
  const total = await prisma.scholarship.count();
  console.log('Total scholarships:', total);
  
  // Check forWomen scholarships
  const forWomen = await prisma.scholarship.count({ where: { forWomen: true } });
  console.log('For women:', forWomen);
  
  // Check forAfrican scholarships  
  const forAfrican = await prisma.scholarship.count({ where: { forAfrican: true } });
  console.log('For African:', forAfrican);
  
  // Check coversTuition
  const coversTuition = await prisma.scholarship.count({ where: { coversTuition: true } });
  console.log('Covers tuition:', coversTuition);
  
  // Check coversLiving
  const coversLiving = await prisma.scholarship.count({ where: { coversLiving: true } });
  console.log('Covers living:', coversLiving);
  
  // Check by type
  const fullScholarships = await prisma.scholarship.count({ where: { type: 'FULL' } });
  const partialScholarships = await prisma.scholarship.count({ where: { type: 'PARTIAL' } });
  console.log('Full scholarships:', fullScholarships);
  console.log('Partial scholarships:', partialScholarships);
  
  // Check test requirements
  const noTest = await prisma.scholarship.count({ 
    where: { 
      AND: [
        { requiresIELTS: false },
        { requiresTOEFL: false },
        { requiresGRE: false },
        { requiresGMAT: false }
      ]
    } 
  });
  console.log('No test required:', noTest);
  
  // Sample few scholarships
  const samples = await prisma.scholarship.findMany({
    take: 3,
    select: {
      name: true,
      type: true,
      forWomen: true,
      forAfrican: true,
      coversTuition: true,
      coversLiving: true,
      degreeLevel: true,
      fieldOfStudy: true,
      requiresIELTS: true,
      requiresTOEFL: true,
      requiresGRE: true,
      requiresGMAT: true
    }
  });
  console.log('\nSample scholarships:', JSON.stringify(samples, null, 2));
}

checkData()
  .then(() => process.exit(0))
  .catch(e => { 
    console.error(e); 
    process.exit(1); 
  });
