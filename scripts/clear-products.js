const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

async function clearProducts() {
  try {
    const result = await prisma.product.deleteMany({});
    console.log(`Successfully deleted ${result.count} products.`);
  } catch (error) {
    console.error("Failed to delete products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearProducts();
