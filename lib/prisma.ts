import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuration Prisma optimisée pour Vercel (serverless)
const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? (['query', 'error', 'warn'] as Prisma.LogLevel[])
    : (['error'] as Prisma.LogLevel[]),
}

// Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined!');
  throw new Error('DATABASE_URL environment variable is not set');
}

  // Log la connection string (masquée) pour debug
if (process.env.NODE_ENV === 'production') {
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'undefined';
  console.log('[Prisma] DATABASE_URL:', maskedUrl);
  
  // Détecter le provider
  if (dbUrl?.includes('.neon.tech')) {
    console.log('[Prisma] Provider: Neon');
  } else {
    console.log('[Prisma] Provider: PostgreSQL (generic)');
  }
}

// En production (Vercel), créer toujours une nouvelle instance pour éviter les problèmes de cache
// En développement, réutiliser l'instance globale pour éviter les connexions multiples
export const prisma =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient(prismaClientOptions)
    : (globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions))

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

