import { password } from "bun";
import { z, ZodType } from "zod";

export class employeeValidation {

    static readonly CREATE: ZodType = z.object({
        username: z.string().min(1, { message: "Username cannot be empty" }).max(100),
        fullName: z.string().min(1, { message: "fullname cannot be empty" }),
        password: z.string().min(1, { message: "Password cannot be empty" }).max(100),
        outletId: z.number().min(1, { message: "Employee must be assigned to outlet" })
    })
    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(1, { message: "Username cannot be empty" }).max(100),
        fullName: z.string().min(1, { message: "fullname cannot be empty" }),
        password: z.string().min(1, { message: "Password cannot be empty" }).max(100),
        outletId: z.number().min(1, { message: "Employee must be assigned to outlet" })
    })

}