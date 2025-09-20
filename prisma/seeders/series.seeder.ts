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
    // some workspaces don't have a 'series' model in Prisma schema; guard at runtime
    const client: any = prisma as any;
    if (!client.series) continue;
    await client.series.upsert({
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