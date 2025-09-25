import { z } from 'zod';

/**
 * Zod schema for validating the request body when creating a new blog post.
 * This schema is based on the provided blog_posts Prisma model.
 */
export const createPostSchema = z.object({
  // title is required and mapped to the VarChar(255) limit.
  title: z
    .string()
    .min(1, 'Title cannot be empty.')
    .max(255, 'Title cannot exceed 255 characters.'),
  
  // While a slug can be provided, it is highly recommended to generate 
  // this on the server from the title to ensure it's unique and formatted correctly.
  slug: z.string().max(255, 'Slug cannot exceed 255 characters.'),

  // These are foreign keys and must be provided.
  user_id: z.number().int().positive('User ID must be a positive integer.'),

  // The main body of the post. Can be optional.
  content: z.string().optional().nullable(),

  // Optional fields that the client can provide.
  // Database defaults (e.g., is_published: false) will be used if omitted.
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  published_at: z
    .union([
        z.string().datetime({ message: 'Invalid datetime string. Must be ISO 8601.' }), 
        z.string().datetime()
    ])
    .optional()
    .nullable(),
  excerpt: z.string().optional().nullable(),
  featured_image: z
    .string()
    .url({ message: 'Featured image must be a valid URL.' })
    .max(255, 'Featured image URL cannot exceed 255 characters.')
    .optional()
    .nullable(),

  // For JSON fields, `z.any()` provides basic validation. For more safety, 
  // you could define a more specific Zod object if you know the structure.
  content_blocks: z.any().optional().nullable(),
  seo_meta: z.any().optional().nullable(),
  
  // Reading time should typically be calculated on the backend based on the content.
  reading_time: z.number().int().optional().nullable(),
});

/**
 * TypeScript type inferred from the Zod schema.
 * Use this in your controller and service for full type safety.
 */
export type CreatePostDto = z.infer<typeof createPostSchema>;

