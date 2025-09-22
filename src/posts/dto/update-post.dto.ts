import { createZodDto } from 'nestjs-zod';

import { createPostSchema } from '../schemas/create-post.schema';



/**
 * Zod schema for validating the request body when updating an existing blog post.
 * It takes the createPostSchema and makes all its fields optional,
 * as a client might only send the fields they wish to change.
 */
export const updatePostSchema = createPostSchema.partial();

/**
 * TypeScript type inferred from the update Zod schema.
 * Use this in your controller and service for full type safety on update operations.
 */


export class UpdatePostDto extends createZodDto(updatePostSchema) {}
