import { string } from "zod";

import { createZodDto } from "nestjs-zod";
import { loginReturnSchema } from "../schemas/loginReturnSchema";


export default class LoginReturnDto extends createZodDto(loginReturnSchema) { }