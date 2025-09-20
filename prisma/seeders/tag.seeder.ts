import { PrismaClient } from '@prisma/client';

export async function seedTags(prisma: PrismaClient) {
  console.log('🏷️ Seeding tags...');

  const tagData = [
    { name: 'Web Development', slug: 'web-development', color: '#3B82F6', description: 'Building web applications and websites' },
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', description: 'The programming language of the web', official_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6', description: 'Typed superset of JavaScript', official_url: 'https://www.typescriptlang.org/' },
    { name: 'Node.js', slug: 'nodejs', color: '#339933', description: 'JavaScript runtime for server-side development', official_url: 'https://nodejs.org/' },
    { name: 'React', slug: 'react', color: '#61DAFB', description: 'A JavaScript library for building user interfaces', official_url: 'https://reactjs.org/' },
    { name: 'NestJS', slug: 'nestjs', color: '#E0234E', description: 'Progressive Node.js framework', official_url: 'https://nestjs.com/' },
    { name: 'Performance', slug: 'performance', color: '#10B981', description: 'Optimizing application performance' },
    { name: 'Security', slug: 'security', color: '#EF4444', description: 'Application and web security practices' },
    { name: 'Databases', slug: 'databases', color: '#8B5CF6', description: 'Database design and management' },
    { name: 'Cloud', slug: 'cloud', color: '#06B6D4', description: 'Cloud computing and deployment' },
    { name: 'Tutorial', slug: 'tutorial', color: '#F59E0B', description: 'Step-by-step learning guides' },
    { name: 'API', slug: 'api', color: '#6366F1', description: 'Application Programming Interfaces' },
    { name: 'Frontend', slug: 'frontend', color: '#EC4899', description: 'Client-side development' },
    { name: 'Backend', slug: 'backend', color: '#84CC16', description: 'Server-side development' },
    { name: 'DevOps', slug: 'devops', color: '#F97316', description: 'Development and operations practices' },
  ];

  const tags: any[] = [];

  for (const tagInfo of tagData) {
    const tag = await prisma.tags.upsert({
      where: { slug: tagInfo.slug },
      update: {},
      create: {
        name: tagInfo.name,
        slug: tagInfo.slug,
        color: tagInfo.color,
        description: tagInfo.description,
        official_url: tagInfo.official_url || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    tags.push(tag);
  }

  console.log(`✅ Created ${tags.length} tags`);
  return tags;
}