const { prisma } = require('./lib/prisma.js');

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log("Success:", products.length);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
