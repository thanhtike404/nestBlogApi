import { createZodDto } from 'nestjs-zod';

import { loginSchema } from '../schemas/loginSchema';
export class CreateLoginDto extends createZodDto(loginSchema) { }
