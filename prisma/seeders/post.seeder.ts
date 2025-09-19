import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedPosts(prisma: PrismaClient) {
  console.log('Seeding posts, images, and comments...');

  // Get existing users, categories, tags, and series to link them
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();
  const series = await prisma.series.findMany();

  for (let i = 0; i < 50; i++) {
    const title = faker.lorem.sentence(5);
    const post = await prisma.post.create({
      data: {
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        content: faker.lorem.paragraphs(10),
        status: 'PUBLISHED',
        // Connect to random existing records
        authorId: users[Math.floor(Math.random() * users.length)].id,
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        seriesId: i % 5 === 0 ? series[Math.floor(Math.random() * series.length)].id : undefined,
        tags: {
          connect: [
            { id: tags[Math.floor(Math.random() * tags.length)].id },
            { id: tags[Math.floor(Math.random() * tags.length)].id },
          ],
        },
        // Create related images and comments
        images: {
          create: [
            { url: faker.image.urlLoremFlickr({ category: 'technology' }), altText: 'Tech image 1' },
            { url: faker.image.urlLoremFlickr({ category: 'abstract' }), altText: 'Tech image 2' },
          ],
        },
        comments: {
          create: [
            {
              content: faker.lorem.sentence(),
              authorId: users[Math.floor(Math.random() * users.length)].id,
            },
          ],
        },
      },
    });
  }
}