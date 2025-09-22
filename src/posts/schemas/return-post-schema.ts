import { z } from 'zod';
import { createPostSchema } from "./create-post.schema";

const BlogContentResponseSchema = z.object({
    id: z.string(), // MongoDB ObjectId is a string
    postId: z.number().int(),
    content: z.any(), // `z.any()` is used for flexibility. For better type safety, you could define a specific schema for your block editor's structure.
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const postResponseSchema = createPostSchema.extend({
    // 1. Server-generated fields from PostgreSQL
    id: z.bigint(),
    created_at: z.date(),
    updated_at: z.date(),
    views_count: z.number().int(),

    // 2. Relational data from PostgreSQL


    // 3. Rich content from MongoDB
    content_details: BlogContentResponseSchema.optional().nullable(),
});

export type PostResponseDto = z.infer<typeof postResponseSchema>;
export type BlogContentResponseDto = z.infer<typeof BlogContentResponseSchema>;