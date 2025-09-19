import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedTags(prisma: PrismaClient) {
  console.log('Seeding tags...');

  const tags = [
    'Web Development',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Performance',
    'Security',
    'Databases',
    'Cloud',
    'Tutorial',
  ];

  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
      },
    });
  }
}