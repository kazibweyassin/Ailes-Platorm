import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@ailesglobal.com'
  const password = process.argv[3] || 'Admin123!'
  const name = process.argv[4] || 'Admin User'

  console.log('🔐 Creating admin user...')
  console.log(`Email: ${email}`)
  console.log(`Name: ${name}`)

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    if (existingAdmin.role === 'ADMIN') {
      console.log('✅ Admin user already exists with this email!')
      console.log('To update password, use: npm run create-admin <email> <new-password>')
      return
    } else {
      // Update existing user to admin
      const hashedPassword = await hash(password, 12)
      await prisma.user.update({
        where: { email },
        data: {
          role: UserRole.ADMIN,
          password: hashedPassword,
          name: name
        }
      })
      console.log('✅ Updated existing user to admin role!')
      return
    }
  }

  // Create new admin user
  const hashedPassword = await hash(password, 12)
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date()
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log(`\n📋 Login Credentials:`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`\n⚠️  Please change the password after first login!`)
  console.log(`\n🌐 Access admin panel at: http://localhost:3000/admin`)
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })











