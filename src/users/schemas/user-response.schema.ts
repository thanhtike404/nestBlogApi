import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  fullName: z.string().nullable(),
  bio: z.string().nullable(),
  githubUrl: z.string().nullable(),
  twitterUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});
