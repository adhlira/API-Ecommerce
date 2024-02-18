import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  const category = await prisma.category.findMany();
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        category_id: category[Math.floor(Math.random() * category.length)].id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 200 })),
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
