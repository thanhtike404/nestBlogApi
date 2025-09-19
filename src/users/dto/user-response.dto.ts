import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from '../schemas/create-user.schema';

export class UserResponseDto extends createZodDto(createUserSchema) {}