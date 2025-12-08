import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function resetPassword(email: string, newPassword: string) {
  try {
    // Hash the new password
    const hashedPassword = await hash(newPassword, 12)
    
    // Update the user
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true }
    })
    
    console.log('Password updated successfully for:', user)
  } catch (error) {
    console.error('Error updating password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email and password from command line arguments
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: npx tsx scripts/reset-password.ts <email> <password>')
  process.exit(1)
}

resetPassword(email, password)
