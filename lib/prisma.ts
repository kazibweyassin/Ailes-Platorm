import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not configured. Database features will not work.');
  console.warn('⚠️  Please set DATABASE_URL in your .env.local file.');
  console.warn('⚠️  Get a free database at: https://neon.tech or https://supabase.com');
}

export const prisma = process.env.DATABASE_URL 
  ? (globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }))
  : null as any; // Fallback to null if no DATABASE_URL

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export default prisma
