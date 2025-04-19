import type { password } from "bun";
import { number, z, ZodType } from "zod";



export class RoleValidation {

    static readonly CREATE : ZodType = z.object({
        roleName : z.string().min(1, {message: "Role name cannot be empty"}).max(100)
    })
}