import { PrismaClient } from '@prisma/client';
const { faker } = require('@faker-js/faker');
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...');

  const users: any[] = [];

  // Create a few specific users first
  const specificUsers = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
    {
      email: 'alex.wilson@example.com',
      name: 'Alex Wilson',
    },
  ];

  for (const userData of specificUsers) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.users.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    users.push(user);
  }

  // Generate additional random users
  for (let i = 0; i < 7; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const email = `user${i}@example.com`;

    const user = await prisma.users.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: faker.person.fullName(),
        password: hashedPassword,
        email_verified_at: Math.random() > 0.3 ? new Date() : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);
  return users;
}