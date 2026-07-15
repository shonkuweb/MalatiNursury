import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'

const globalForPrisma = globalThis

let prisma;

if (!globalForPrisma.prisma) {
  const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'dev.db')
  const fallbackUrl = `file:${dbPath}`;
  process.env.DATABASE_URL = process.env.DATABASE_URL || fallbackUrl;

  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })

  globalForPrisma.prisma = new PrismaClient({ 
    adapter 
  })
}

prisma = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
