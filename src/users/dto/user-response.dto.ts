import { createZodDto } from 'nestjs-zod';
import { userResponseSchema } from '../schemas/user-response.schema';

export class UserResponseDto extends createZodDto(userResponseSchema) {}
