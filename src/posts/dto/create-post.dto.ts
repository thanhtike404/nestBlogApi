import { createZodDto } from 'nestjs-zod';

import { createPostSchema } from '../schemas/create-post.schema';
export class CreateBlogPostDto extends createZodDto(createPostSchema) {}
