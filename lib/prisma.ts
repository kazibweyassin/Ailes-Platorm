import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

const prismaClient = databaseUrl
  ? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  : null

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  prismaClient ??
  (new Proxy({} as PrismaClient, {
    get() {
      throw new Error('PrismaClient is not initialized: DATABASE_URL is missing.')
    },
  }) as PrismaClient)

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}

export default prisma
