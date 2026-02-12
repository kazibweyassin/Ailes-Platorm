import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkScholarshipURLs() {
  try {
    console.log('📊 Checking Scholarship URLs...\n');
    
    // Get total scholarships
    const total = await prisma.scholarship.count();
    console.log(`Total scholarships: ${total}\n`);
    
    // Check scholarships with URLs
    const withWebsite = await prisma.scholarship.count({
      where: {
        AND: [
          { website: { not: null } },
          { website: { not: '' } }
        ]
      }
    });
    
    const withAppLink = await prisma.scholarship.count({
      where: {
        AND: [
          { applicationLink: { not: null } },
          { applicationLink: { not: '' } }
        ]
      }
    });
    
    console.log(`Scholarships with website: ${withWebsite} (${((withWebsite/total)*100).toFixed(1)}%)`);
    console.log(`Scholarships with applicationLink: ${withAppLink} (${((withAppLink/total)*100).toFixed(1)}%)\n`);
    
    // Get sample URLs to see what they look like
    const samples = await prisma.scholarship.findMany({
      select: {
        id: true,
        name: true,
        website: true,
        applicationLink: true
      },
      take: 20
    });
    
    console.log('📋 Sample URLs:\n');
    samples.forEach((scholarship, i) => {
      console.log(`${i + 1}. ${scholarship.name.substring(0, 50)}...`);
      console.log(`   Website: ${scholarship.website || 'NULL'}`);
      console.log(`   App Link: ${scholarship.applicationLink || 'NULL'}\n`);
    });
    
    // Check for common invalid patterns
    const invalidPatterns = [
      'example.com',
      'placeholder',
      'test.com',
      'N/A',
      'TBD',
      'coming soon',
      'http://example',
      'https://example',
      'website.com'
    ];
    
    const scholarshipsWithInvalidUrls = await prisma.scholarship.findMany({
      where: {
        OR: [
          ...invalidPatterns.map(pattern => ({
            website: {
              contains: pattern,
              mode: 'insensitive' as const
            }
          })),
          ...invalidPatterns.map(pattern => ({
            applicationLink: {
              contains: pattern,
              mode: 'insensitive' as const
            }
          }))
        ]
      },
      select: {
        id: true,
        name: true,
        website: true,
        applicationLink: true
      },
      take: 50
    });
    
    console.log(`\n⚠️ Found ${scholarshipsWithInvalidUrls.length} scholarships with potentially invalid URLs:\n`);
    scholarshipsWithInvalidUrls.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   Website: ${s.website}`);
      console.log(`   App Link: ${s.applicationLink}\n`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkScholarshipURLs();
