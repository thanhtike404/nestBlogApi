import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('password123', salt);

  for (let i = 0; i < 10; i++) {
    await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        username: faker.internet.username().toLowerCase(), // FIX: Was userName
        passwordHash: hashedPassword,
        fullName: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        githubUrl: `https://github.com/${faker.internet.username()}`, // FIX: Was userName
        twitterUrl: `https://twitter.com/${faker.internet.username()}`, // FIX: Was userName
      },
    });
  }
}