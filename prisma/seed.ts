import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';
import { seedCategories } from './seeders/category.seeder';
import { seedTags } from './seeders/tag.seeder';
import { seedSeries } from './seeders/series.seeder';
import { seedPosts } from './seeders/post.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // The order is important due to relations
  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedTags(prisma);
  await seedSeries(prisma);
  await seedPosts(prisma); // Posts seeder will handle images and comments

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