import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getMajorScholarships() {
  console.log('📊 Getting Major Scholarships...\n')

  // Get featured, verified, and most recently created scholarships
  const scholarships = await prisma.scholarship.findMany({
    where: {
      OR: [
        { featured: true },
        { verified: true },
        { views: { gte: 10 } }
      ]
    },
    orderBy: [
      { featured: 'desc' },
      { verified: 'desc' },
      { views: 'desc' }
    ],
    take: 50,
    select: {
      id: true,
      name: true,
      provider: true,
      website: true,
      applicationLink: true,
      featured: true,
      verified: true,
      views: true
    }
  })

  console.log(`Found ${scholarships.length} major scholarships\n`)
  console.log('=' .repeat(80))
  
  scholarships.forEach((s, index) => {
    console.log(`\n${index + 1}. ${s.name}`)
    console.log(`   Provider: ${s.provider}`)
    console.log(`   Featured: ${s.featured ? '⭐' : '❌'} | Verified: ${s.verified ? '✓' : '❌'} | Views: ${s.views}`)
    console.log(`   Website: ${s.website || 'MISSING'}`)
    console.log(`   App Link: ${s.applicationLink || 'MISSING'}`)
    console.log(`   ID: ${s.id}`)
  })

  await prisma.$disconnect()
}

getMajorScholarships().catch(console.error)
