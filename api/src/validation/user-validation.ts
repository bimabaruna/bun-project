import type { password } from "bun";
import { number, z, ZodType } from "zod";



export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1, { message: "Username cannot be empty" }).max(100),
        password: z.string().min(1, { message: "Password cannot be empty" }).max(100),
        name: z.string().min(1).max(100),
        roleId: z.number().min(1).optional()
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(1, { message: "Username cannot be empty" }).max(100),
        password: z.string().min(1, { message: 'Password cannot be empty' }).max(100),
    })

    static readonly UPDATE: ZodType = z.object({
        password: z.string().min(1, {message: 'Password cannot be empty'}).max(100).optional(),
        name: z.string().min(1, {message: 'name cannot be empty'}).max(100).optional(),
        roleId: z.number().min(1).optional()
    })

    static readonly TOKEN: ZodType = z.string().min(1)

    static readonly USER_LIST: ZodType = z.string().min(1)

    static readonly GET: ZodType = z.number().min(1)

    static readonly UPDATEBYID: ZodType = number().min(1)
}