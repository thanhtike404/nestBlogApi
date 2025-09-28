import { access } from "fs";
import { z } from "zod";

export const loginReturnSchema = z.object({
    access_token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
    }),
});