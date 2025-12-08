import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function clearUsers() {
  try {
    console.log("🗑️  Clearing users from database...")
    
    // Delete all users
    const result = await prisma.user.deleteMany({})
    
    console.log(`✅ Deleted ${result.count} users`)
    console.log("🎉 Users cleared successfully!")
  } catch (error) {
    console.error("❌ Error clearing users:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearUsers()
