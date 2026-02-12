import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAllUrls() {
  console.log('🔍 Checking All Scholarship URLs...\n')

  const scholarships = await prisma.scholarship.findMany({
    orderBy: [
      { featured: 'desc' },
      { verified: 'desc' },
      { views: 'desc' }
    ],
    select: {
      id: true,
      name: true,
      provider: true,
      website: true,
      applicationLink: true,
      featured: true,
      verified: true
    }
  })

  const missing: any[] = []
  const needsReview: any[] = []

  scholarships.forEach(s => {
    const hasWebsite = s.website && s.website.trim().length > 0
    const hasAppLink = s.applicationLink && s.applicationLink.trim().length > 0

    // Missing both
    if (!hasWebsite && !hasAppLink) {
      missing.push(s)
    }
    // Missing one or the other
    else if (!hasWebsite || !hasAppLink) {
      needsReview.push({ ...s, type: !hasWebsite ? 'No Website' : 'No App Link' })
    }
  })

  console.log(`Total Scholarships: ${scholarships.length}`)
  console.log(`✅ Complete URLs: ${scholarships.length - missing.length - needsReview.length}`)
  console.log(`⚠️  Missing One URL: ${needsReview.length}`)
  console.log(`❌ Missing Both URLs: ${missing.length}\n`)

  if (missing.length > 0) {
    console.log('=' .repeat(80))
    console.log('❌ SCHOLARSHIPS MISSING BOTH URLs:')
    console.log('=' .repeat(80))
    missing.forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.name}`)
      console.log(`   Provider: ${s.provider}`)
      console.log(`   Featured: ${s.featured ? '⭐' : '❌'} | Verified: ${s.verified ? '✓' : '❌'}`)
      console.log(`   ID: ${s.id}`)
    })
  }

  if (needsReview.length > 0 && needsReview.length <= 50) {
    console.log('\n' + '='.repeat(80))
    console.log('⚠️  SCHOLARSHIPS MISSING ONE URL:')
    console.log('=' .repeat(80))
    needsReview.slice(0, 20).forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.name} [${s.type}]`)
      console.log(`   Provider: ${s.provider}`)
      console.log(`   Featured: ${s.featured ? '⭐' : '❌'} | Verified: ${s.verified ? '✓' : '❌'}`)
      console.log(`   Website: ${s.website || 'MISSING'}`)
      console.log(`   App Link: ${s.applicationLink || 'MISSING'}`)
      console.log(`   ID: ${s.id}`)
    })
  }

  await prisma.$disconnect()
}

checkAllUrls().catch(console.error)
