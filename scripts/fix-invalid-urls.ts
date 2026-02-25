import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixInvalidUrls() {
  console.log('🔧 Fixing Invalid Scholarship URLs...\n');
  
  // Common invalid patterns
  const invalidPatterns = [
    'example.com',
    'placeholder',
    'test.com',
    'website.com',
    'N/A',
    'TBD',
    'coming soon',
    'http://example',
    'https://example',
    'null',
    'undefined',
  ];
  
  // Find scholarships with invalid patterns
  const scholarships = await prisma.scholarship.findMany({
    where: {
      OR: [
        ...invalidPatterns.flatMap(pattern => [
          { website: { contains: pattern, mode: 'insensitive' as const } },
          { applicationLink: { contains: pattern, mode: 'insensitive' as const } },
        ]),
        // Empty or very short URLs (likely invalid)
        { website: { not: null, in: ['', '#', '/', 'http://', 'https://'] } },
        { applicationLink: { not: null, in: ['', '#', '/', 'http://', 'https://'] } },
      ],
    },
    select: {
      id: true,
      name: true,
      website: true,
      applicationLink: true,
      provider: true,
    },
  });
  
  console.log(`Found ${scholarships.length} scholarships with potentially invalid URLs\n`);
  
  if (scholarships.length === 0) {
    console.log('✅ No obviously invalid URLs found!');
    await prisma.$disconnect();
    return;
  }
  
  // Clean them up
  let fixed = 0;
  for (const scholarship of scholarships) {
    let needsUpdate = false;
    const updates: any = {};
    
    if (scholarship.website && invalidPatterns.some(pattern => 
      scholarship.website?.toLowerCase().includes(pattern.toLowerCase())
    )) {
      updates.website = null;
      needsUpdate = true;
      console.log(`❌ Removing invalid website from: ${scholarship.name}`);
      console.log(`   Was: ${scholarship.website}\n`);
    }
    
    if (scholarship.applicationLink && invalidPatterns.some(pattern =>
      scholarship.applicationLink?.toLowerCase().includes(pattern.toLowerCase())
    )) {
      updates.applicationLink = null;
      needsUpdate = true;
      console.log(`❌ Removing invalid application link from: ${scholarship.name}`);
      console.log(`   Was: ${scholarship.applicationLink}\n`);
    }
    
    if (needsUpdate) {
      await prisma.scholarship.update({
        where: { id: scholarship.id },
        data: updates,
      });
      fixed++;
    }
  }
  
  console.log(`\n✅ Fixed ${fixed} scholarships\n`);
  
  // Now let's find scholarships with NO URLs at all
  const withoutUrls = await prisma.scholarship.count({
    where: {
      AND: [
        { OR: [{ website: null }, { website: '' }] },
        { OR: [{ applicationLink: null }, { applicationLink: '' }] },
      ],
    },
  });
  
  console.log(`ℹ️  ${withoutUrls} scholarships have no URLs at all`);
  console.log(`   These will display a "Contact provider directly" message in the UI\n`);
  
  await prisma.$disconnect();
}

fixInvalidUrls().catch(console.error);
