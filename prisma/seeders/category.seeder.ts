import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedCategories(prisma: PrismaClient) {
  console.log('Seeding categories...');
  const categories = ['JavaScript', 'TypeScript', 'NestJS', 'Databases', 'DevOps'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: faker.helpers.slugify(name).toLowerCase() },
    });
  }
}