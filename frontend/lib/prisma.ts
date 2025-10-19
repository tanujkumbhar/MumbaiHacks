import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.error('Please create a .env.local file with:')
  console.error('DATABASE_URL="mongodb://localhost:27017/taxwise"')
  console.error('JWT_SECRET="your-super-secret-jwt-key-for-hackathon-2024"')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma