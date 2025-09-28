import { z } from 'zod';

export const FollowUserSchema = z.object({
  followerId: z.bigint(),
  followedId: z.bigint(),
});
