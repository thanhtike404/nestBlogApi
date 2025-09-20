import { PrismaClient } from '@prisma/client';
const { faker } = require('@faker-js/faker');

export async function seedPosts(prisma: PrismaClient) {
  console.log('📝 Seeding blog posts...');

  // Get existing users, categories, and tags to link them
  const users = await prisma.users.findMany();
  const categories = await prisma.categories.findMany();
  const tags = await prisma.tags.findMany();

  if (users.length === 0 || categories.length === 0 || tags.length === 0) {
    console.log('⚠️ No users, categories, or tags found. Please seed them first.');
    return [];
  }

  const posts: any[] = [];

  // Sample blog post content for tech blog
  const samplePosts = [
    {
      title: 'Getting Started with NestJS: A Complete Guide',
      excerpt: 'Learn how to build scalable Node.js applications with NestJS framework',
      content: `# Getting Started with NestJS

NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.

## Why Choose NestJS?

- **TypeScript Support**: Built with TypeScript from the ground up
- **Modular Architecture**: Organize your code into modules
- **Dependency Injection**: Powerful DI container
- **Decorators**: Extensive use of decorators for clean code

## Installation

\`\`\`bash
npm i -g @nestjs/cli
nest new project-name
\`\`\`

This guide will walk you through creating your first NestJS application.`,
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    },
    {
      title: 'TypeScript Best Practices for 2024',
      excerpt: 'Essential TypeScript patterns and practices every developer should know',
      content: `# TypeScript Best Practices

TypeScript has become the standard for JavaScript development. Here are the essential practices you should follow.

## Type Safety First

Always prefer explicit types over \`any\`:

\`\`\`typescript
// Bad
function process(data: any): any {
  return data.result;
}

// Good
interface ApiResponse {
  result: string;
  status: number;
}

function process(data: ApiResponse): string {
  return data.result;
}
\`\`\`

## Use Strict Mode

Enable strict mode in your tsconfig.json for better type checking.`,
      featured_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    },
    {
      title: 'Building RESTful APIs with Prisma and PostgreSQL',
      excerpt: 'A comprehensive guide to database-driven API development',
      content: `# Building APIs with Prisma

Prisma is a next-generation ORM that makes database access easy and type-safe.

## Setting Up Prisma

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema Definition

Define your data model in \`schema.prisma\`:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
\`\`\`

This tutorial covers everything from setup to deployment.`,
      featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
  ];

  // Create sample posts
  for (let i = 0; i < samplePosts.length; i++) {
    const postData = samplePosts[i];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const post = await prisma.blog_posts.create({
      data: {
        title: postData.title,
        slug: `${faker.helpers.slugify(postData.title).toLowerCase()}-${Date.now()}`,
        excerpt: postData.excerpt,
        content: postData.content,
        featured_image: postData.featured_image,
        is_published: true,
        published_at: new Date(),
        user_id: BigInt(randomUser.id),
        category_id: BigInt(randomCategory.id),
        reading_time: Math.floor(Math.random() * 10) + 3, // 3-12 minutes
        views_count: Math.floor(Math.random() * 1000),
        is_featured: i === 0, // Make first post featured
        content_blocks: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: postData.content }
            }
          ]
        },
        seo_meta: {
          title: postData.title,
          description: postData.excerpt,
          keywords: ['programming', 'web development', 'tutorial']
        },
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Add random tags to the post
    const randomTags = faker.helpers.arrayElements(tags, { min: 2, max: 4 });
    for (const tag of randomTags) {
      await prisma.post_tag.create({
        data: {
          post_id: BigInt(post.id),
          tag_id: BigInt(tag.id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    // Add additional categories (many-to-many)
    const additionalCategories = faker.helpers.arrayElements(categories, { min: 0, max: 2 });
    for (const category of additionalCategories) {
      if (category.id !== randomCategory.id) {
        await prisma.post_category.create({
          data: {
            post_id: BigInt(post.id),
            category_id: BigInt(category.id),
          },
        });
      }
    }

    posts.push(post);
  }

  // Generate additional random posts
  for (let i = 0; i < 15; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const post = await prisma.blog_posts.create({
      data: {
        title,
        slug: `${faker.helpers.slugify(title).toLowerCase()}-${i}-${Date.now()}`,
        excerpt: faker.lorem.sentences(2),
        content: faker.lorem.paragraphs(5, '\n\n'),
        featured_image: `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}?w=800`,
        is_published: Math.random() > 0.2, // 80% published
        published_at: Math.random() > 0.2 ? faker.date.recent({ days: 30 }) : null,
        user_id: BigInt(randomUser.id),
        category_id: BigInt(randomCategory.id),
        reading_time: Math.floor(Math.random() * 15) + 2,
        views_count: Math.floor(Math.random() * 500),
        is_featured: Math.random() > 0.9, // 10% featured
        content_blocks: {
          blocks: [
            {
              type: 'header',
              data: { text: title, level: 1 }
            },
            {
              type: 'paragraph',
              data: { text: faker.lorem.paragraphs(3) }
            }
          ]
        },
        seo_meta: {
          title,
          description: faker.lorem.sentences(2),
          keywords: faker.helpers.arrayElements(['programming', 'web', 'development', 'tutorial', 'guide'], { min: 2, max: 4 })
        },
        created_at: faker.date.recent({ days: 60 }),
        updated_at: new Date(),
      },
    });

    // Add random tags
    const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 5 });
    for (const tag of randomTags) {
      await prisma.post_tag.create({
        data: {
          post_id: BigInt(post.id),
          tag_id: BigInt(tag.id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} blog posts with tags and categories`);
  return posts;
}