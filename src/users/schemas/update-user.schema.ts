import { z } from 'zod';

export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    fullName: z.string().optional(),
    bio: z.string().optional(),
    githubUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
}).strict();