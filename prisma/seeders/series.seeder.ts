import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedSeries(prisma: PrismaClient) {
  console.log('Seeding series...');

  const series = [
    'Getting Started with NestJS',
    'Advanced TypeScript Patterns',
    'Building a Full-Stack Application',
  ];

  for (const title of series) {
    await prisma.series.upsert({
      where: { title },
      update: {},
      create: {
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        description: faker.lorem.sentence(),
      },
    });
  }
}