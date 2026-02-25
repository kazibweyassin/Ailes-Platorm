import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Additional URL updates for common scholarships
const moreCorrectUrls: Record<string, { website: string; applicationLink: string } | 'DELETE'> = {
  // World Bank JJ/WBGSP Participating Programs
  'cml3vpxqt001epqay4syc68g6': {
    website: 'https://www.worldbank.org',
    applicationLink: 'https://www.worldbank.org/en/programs/scholarships#jj-wbgsp'
  },
  // Delete this - it's not a scholarship, it's a note
  'cml3vpy6q001fpqayei4s374x': 'DELETE',
  // Delete this - seems like a placeholder
  'cml3vqapm0026pqaydvd657pu': 'DELETE',
}

// More mainstream scholarships to research and update
async function getCollegeScholarshipsOrgUrls() {
  // These are from collegescholarships.org - let's find their actual provider URLs
  const scholarships = await prisma.scholarship.findMany({
    where: {
      website: {
        contains: 'collegescholarships.org'
      }
    },
    select: {
      id: true,
      name: true,
      provider: true,
      website: true,
      applicationLink: true
    },
    take: 30
  })

  return scholarships
}

async function updateMoreUrls() {
  console.log('🔧 Updating More Scholarship URLs...\n')

  let updated = 0
  let deleted = 0

  for (const [id, action] of Object.entries(moreCorrectUrls)) {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      select: { name: true, website: true, applicationLink: true }
    })

    if (!scholarship) {
      console.log(`⚠️  Scholarship ${id} not found`)
      continue
    }

    if (action === 'DELETE') {
      console.log(`\n🗑️  Deleting: ${scholarship.name}`)
      console.log(`   Reason: Not a real scholarship (placeholder/note)`)
      
      await prisma.scholarship.delete({
        where: { id }
      })
      deleted++
    } else {
      console.log(`\n✏️  Updating: ${scholarship.name}`)
      console.log(`   Old Website: ${scholarship.website || 'MISSING'}`)
      console.log(`   New Website: ${action.website}`)
      console.log(`   Old App Link: ${scholarship.applicationLink || 'MISSING'}`)
      console.log(`   New App Link: ${action.applicationLink}`)

      await prisma.scholarship.update({
        where: { id },
        data: {
          website: action.website,
          applicationLink: action.applicationLink
        }
      })
      updated++
    }
  }

  console.log(`\n✅ Updated ${updated} scholarships`)
  console.log(`🗑️  Deleted ${deleted} invalid entries`)

  // Check for collegescholarships.org entries
  console.log('\n\n🔍 Checking collegescholarships.org entries...')
  const csOrg = await getCollegeScholarshipsOrgUrls()
  
  if (csOrg.length > 0) {
    console.log(`\nFound ${csOrg.length} scholarships from collegescholarships.org`)
    console.log('Note: These URLs may redirect properly, but ideally should point to original providers\n')
    
    csOrg.slice(0, 10).forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`)
      console.log(`   Provider: ${s.provider}`)
      console.log(`   URL: ${s.website}`)
    })
  }

  await prisma.$disconnect()
}

updateMoreUrls().catch(console.error)
