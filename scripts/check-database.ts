import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database contents...\n')

  try {
    // Check Users
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    console.log(`👥 Users: ${userCount} total`)
    if (users.length > 0) {
      console.log('   Recent users:')
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.name || 'No name'}) - Role: ${user.role}`)
      })
    }
    console.log('')

    // Check Scholarships
    const scholarshipCount = await prisma.scholarship.count()
    const scholarships = await prisma.scholarship.findMany({
      select: {
        id: true,
        name: true,
        provider: true,
        country: true,
        amount: true,
        currency: true,
        deadline: true,
        featured: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    console.log(`🎓 Scholarships: ${scholarshipCount} total`)
    if (scholarships.length > 0) {
      console.log('   Recent scholarships:')
      scholarships.forEach((sch) => {
        const amount = sch.amount ? `${sch.currency} ${sch.amount.toLocaleString()}` : 'Varies'
        console.log(`   - ${sch.name} by ${sch.provider} (${sch.country}) - ${amount}`)
      })
    }
    console.log('')

    // Check Universities
    const universityCount = await prisma.university.count()
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        city: true,
        ranking: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    console.log(`🏛️  Universities: ${universityCount} total`)
    if (universities.length > 0) {
      console.log('   Recent universities:')
      universities.forEach((uni) => {
        const location = uni.city ? `${uni.city}, ${uni.country}` : uni.country
        const rank = uni.ranking ? `#${uni.ranking}` : 'Unranked'
        console.log(`   - ${uni.name} (${location}) - ${rank}`)
      })
    }
    console.log('')

    // Check Applications
    const applicationCount = await prisma.application.count()
    console.log(`📝 Applications: ${applicationCount} total`)
    console.log('')

    // Check Sponsors
    const sponsorCount = await prisma.sponsor.count()
    const sponsors = await prisma.sponsor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        amount: true,
        type: true,
        tierName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    console.log(`💰 Sponsors: ${sponsorCount} total`)
    if (sponsors.length > 0) {
      console.log('   Recent sponsors:')
      sponsors.forEach((sponsor) => {
        const amount = sponsor.amount ? `$${sponsor.amount.toLocaleString()}` : 'Not specified'
        console.log(`   - ${sponsor.name} (${sponsor.email}) - ${sponsor.status} - ${sponsor.type} - ${sponsor.tierName} - ${amount}`)
      })
    }
    console.log('')

    // Check Student Intakes
    const intakeCount = await prisma.studentIntake.count()
    const intakes = await prisma.studentIntake.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    console.log(`📋 Student Intakes: ${intakeCount} total`)
    if (intakes.length > 0) {
      console.log('   Recent intakes:')
      intakes.forEach((intake) => {
        console.log(`   - ${intake.firstName} ${intake.lastName} (${intake.email}) - ${intake.status}`)
      })
    }
    console.log('')

    // Check Saved Items
    const savedScholarshipsCount = await prisma.savedScholarship.count()
    const savedUniversitiesCount = await prisma.savedUniversity.count()
    console.log(`⭐ Saved Items: ${savedScholarshipsCount} scholarships, ${savedUniversitiesCount} universities`)
    console.log('')

    // Summary
    console.log('📊 Summary:')
    console.log(`   Total Users: ${userCount}`)
    console.log(`   Total Scholarships: ${scholarshipCount}`)
    console.log(`   Total Universities: ${universityCount}`)
    console.log(`   Total Applications: ${applicationCount}`)
    console.log(`   Total Sponsors: ${sponsorCount}`)
    console.log(`   Total Student Intakes: ${intakeCount}`)

  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

