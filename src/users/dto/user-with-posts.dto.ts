import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema for an individual post, defining what post data to return.
const PostSchema = z.object({
  id: z.bigint(),
  title: z.string(),
  slug: z.string(),
  is_published: z.boolean(),
  published_at: z.date().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  views_count: z.number().int(),
});

// Schema for the main response object.
const UserWithPostsResponseSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.date().nullable(),
  blog_posts: z.array(PostSchema),
});

// Create a DTO class from the Zod schema.
export class UserWithPostsResponseDto extends createZodDto(
  UserWithPostsResponseSchema,
) {}
