import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Researched correct URLs for major scholarships
const correctUrls: Record<string, { website: string; applicationLink: string }> = {
  // MEXT Scholarship
  'cml3sgau60002e04agy7o3x6n': {
    website: 'https://www.studyinjapan.go.jp',
    applicationLink: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/'
  },
  // World Bank Scholarships
  'cml3sgeo40008e04a904c10sw': {
    website: 'https://www.worldbank.org',
    applicationLink: 'https://www.worldbank.org/en/programs/scholarships'
  },
  // African Union Kwame Nkrumah Scientific Awards
  'cml6l1cf2000165zaluavkf7b': {
    website: 'https://au.int',
    applicationLink: 'https://au.int/en/awards/kwame-nkrumah-scientific-awards'
  },
  // African Development Bank Scholarship Program
  'cml6l1d3h000265zae24nt8ws': {
    website: 'https://www.afdb.org',
    applicationLink: 'https://www.afdb.org/en/about-us/careers/scholarship-programme'
  },
  // Commonwealth Scholarship - Update outdated domain
  'cml3sg9oj0000e04atmnapwsi': {
    website: 'https://cscuk.fcdo.gov.uk',
    applicationLink: 'https://cscuk.fcdo.gov.uk/apply/'
  },
  // Erasmus Mundus - More specific URL
  'cml3sgadk0001e04a3neul175': {
    website: 'https://www.eacea.ec.europa.eu',
    applicationLink: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'
  },
  // DAAD - More direct link
  'cml3sgdbt0006e04a3w0daqcn': {
    website: 'https://www.daad.de',
    applicationLink: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/'
  },
  // Fulbright - More specific
  'cml3sge3v0007e04akvl3m7ju': {
    website: 'https://foreign.fulbrightonline.org',
    applicationLink: 'https://foreign.fulbrightonline.org/'
  },
  // Chevening - Direct portal
  'cml3sgcv60005e04a1wn816px': {
    website: 'https://www.chevening.org',
    applicationLink: 'https://www.chevening.org/scholarships/'
  },
  // Chinese Government Scholarship - Application portal
  'cml3sgbzr0004e04ag8wvigxl': { 
    website: 'https://www.campuschina.org',
    applicationLink: 'https://www.campuschina.org/universitieshtml/'
  },
  // Korean Government Scholarship
  'cml3sgbj40003e04acplh4xyj': {
    website: 'https://www.studyinkorea.go.kr',
    applicationLink: 'https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do'
  },
  // Mandela Rhodes - Correct application URL
  'cml3sgf4r0009e04a2ci546qs': {
    website: 'https://www.mandelarhodes.org',
    applicationLink: 'https://www.mandelarhodes.org/scholars/how-to-apply/'
  },
  // Intra-Africa - Pan-African University
  'cml3sgflc000ae04a61lqjk2z': {
    website: 'https://pau-au.africa',
    applicationLink: 'https://pau-au.africa/admissions/'
  },
  // RUFORUM
  'cml6l1ewm000565zalibb3vjc': {
    website: 'https://www.ruforum.org',
    applicationLink: 'https://www.ruforum.org/TAGDev-scholarships'
  },
  // AWARD Fellowship
  'cml6l1fkz000665za5pqxrzbc': {
    website: 'https://awardfellowships.org',
    applicationLink: 'https://awardfellowships.org/fellowship-program/'
  },
  // Mo Ibrahim Foundation
  'cml6l1ega000465zazjkn4ex7': {
    website: 'https://mo.ibrahim.foundation',
    applicationLink: 'https://mo.ibrahim.foundation/leadership-programmes'
  },
  // AERC
  'cml6l1gpq000865zachq2akm5': {
    website: 'https://aercafrica.org',
    applicationLink: 'https://aercafrica.org/programmes/joint-facility-electives-jfe/'
  },
  // Next Einstein Forum
  'cml6l1g1b000765zalsofkppb': {
    website: 'https://nef.org',
    applicationLink: 'https://nef.org/fellowship/'
  },
  // Mastercard Foundation
  'cml6l1bq3000065zakkq04ref': {
    website: 'https://mastercardfdn.org',
    applicationLink: 'https://mastercardfdn.org/all/scholars/'
  },
  // AIMS
  'cml6l1drw000365zamp6kdib5': {
    website: 'https://nexteinstein.org',
    applicationLink: 'https://nexteinstein.org/apply-aims-masters/'
  },
  // African Leadership Academy
  'cml6l1h62000965zak9varol1': {
    website: 'https://www.africanleadershipacademy.org',
    applicationLink: 'https://apply.africanleadershipacademy.org/'
  }
}

async function updateUrls() {
  console.log('🔧 Updating Scholarship URLs with Researched Correct URLs...\n')

  let updated = 0

  for (const [id, urls] of Object.entries(correctUrls)) {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      select: { name: true, website: true, applicationLink: true }
    })

    if (!scholarship) {
      console.log(`⚠️  Scholarship ${id} not found`)
      continue
    }

    console.log(`\n✏️  Updating: ${scholarship.name}`)
    console.log(`   Old Website: ${scholarship.website || 'MISSING'}`)
    console.log(`   New Website: ${urls.website}`)
    console.log(`   Old App Link: ${scholarship.applicationLink || 'MISSING'}`)
    console.log(`   New App Link: ${urls.applicationLink}`)

    await prisma.scholarship.update({
      where: { id },
      data: {
        website: urls.website,
        applicationLink: urls.applicationLink
      }
    })

    updated++
  }

  console.log(`\n✅ Updated ${updated} scholarships with correct URLs`)

  await prisma.$disconnect()
}

updateUrls().catch(console.error)
