import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  console.log('📂 Seeding categories...');

  const categoryData = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'NestJS', slug: 'nestjs' },
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Databases', slug: 'databases' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Mobile Development', slug: 'mobile-development' },
    { name: 'Machine Learning', slug: 'machine-learning' },
  ];

  const categories: any[] = [];

  for (const categoryInfo of categoryData) {
    const category = await prisma.categories.upsert({
      where: { slug: categoryInfo.slug },
      update: {},
      create: {
        name: categoryInfo.name,
        slug: categoryInfo.slug,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    categories.push(category);
  }

  console.log(`✅ Created ${categories.length} categories`);
  return categories;
}