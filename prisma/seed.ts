import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';
import { seedCategories } from './seeders/category.seeder';
import { seedTags } from './seeders/tag.seeder';
import { seedPosts } from './seeders/post.seeder';
import { PrismaClient as MongoPrismaClient } from '../node_modules/@prisma-mongo/prisma/client';

const prisma = new PrismaClient();
const prismaMongo = new MongoPrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // The order is important due to relations
  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedTags(prisma);
  await seedPosts(prisma, prismaMongo); // Posts seeder will handle post_category and post_tag relations

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });