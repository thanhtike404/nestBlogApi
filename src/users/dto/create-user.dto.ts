import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from 'src/tags/schemas/create-user.schema';

export class CreateUserDto extends createZodDto(createUserSchema) {}