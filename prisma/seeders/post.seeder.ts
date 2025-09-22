import { PrismaClient } from '@prisma/client';

import { PrismaClient as MongoPrismaClient } from '@prisma-mongo/prisma/client';
const { faker } = require('@faker-js/faker');


export async function seedPosts(
  prismaPostgres: PrismaClient,
  prismaMongo: MongoPrismaClient,
) {
  console.log('📝 Seeding blog posts...');

  const users = await prismaPostgres.users.findMany();
  const categories = await prismaPostgres.categories.findMany();
  const tags = await prismaPostgres.tags.findMany();

  if (users.length === 0 || categories.length === 0 || tags.length === 0) {
    console.log('⚠️ No users, categories, or tags found. Please seed them first.');
    return [];
  }

  const posts: any[] = [];


  const samplePosts = [
    {
      title: 'Getting Started with NestJS: A Complete Guide',
      excerpt: 'Learn how to build scalable Node.js applications with NestJS framework',
      content_blocks: { /* Your content block JSON */ },
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    },
    {
      title: 'TypeScript Best Practices for 2024',
      excerpt: 'Essential TypeScript patterns and practices every developer should know',
      content_blocks: { /* Your content block JSON */ },
      featured_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    },
    {
      title: 'Building RESTful APIs with Prisma and PostgreSQL',
      excerpt: 'A comprehensive guide to database-driven API development',
      content_blocks: { /* Your content block JSON */ },
      featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
  ];

  for (const postData of samplePosts) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const post = await prismaPostgres.blog_posts.create({
      data: {
        title: postData.title,
        slug: `${faker.helpers.slugify(postData.title).toLowerCase()}-${Date.now()}`,
        excerpt: postData.excerpt,
        featured_image: postData.featured_image,
        is_published: true,
        published_at: new Date(),
        user_id: BigInt(randomUser.id),
        category_id: BigInt(randomCategory.id),
        // ... other fields
      },
    });

    await prismaMongo.blog_content.create({
      data: {
        postId: Number(post.id),
        content: postData.content_blocks || { blocks: [] },
      },
    });

    posts.push(post);
  }

  // Generate additional random posts
  for (let i = 0; i < 15; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const post = await prismaPostgres.blog_posts.create({
      data: {
        title,
        slug: `${faker.helpers.slugify(title).toLowerCase()}-${i}-${Date.now()}`,
        excerpt: faker.lorem.sentences(2),
        user_id: BigInt(randomUser.id),
        category_id: BigInt(randomCategory.id),
      },
    });

    await prismaMongo.blog_content.create({
      data: {
        postId: Number(post.id),
        content: {
          blocks: [{ type: 'paragraph', data: { text: faker.lorem.paragraphs(5) } }]
        },
      },
    });

    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} blog posts with content in MongoDB`);
  return posts;
}
