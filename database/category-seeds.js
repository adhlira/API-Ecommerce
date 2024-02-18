import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany();
  for (let i = 0; i < 3; i++) {
    await prisma.category.create({
      data: {
        name: faker.commerce.product(),
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
