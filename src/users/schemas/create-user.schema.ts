import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  fullName: z.string().optional(),
  bio: z.string().optional(),
  githubUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
});