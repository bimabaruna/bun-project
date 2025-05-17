import { password } from "bun";
import { z, ZodType } from "zod";

export class employeeValidation {

    static readonly CREATE: ZodType = z.object({
        userId: z.number().min(1, { message: "User ID is required" }),
        firstName: z.string().min(1, { message: "First name cannot be empty" }),
        lastName: z.string().min(1, { message: "Last name cannot be empty" }),
        email: z.string().email({ message: "Invalid email address" }),
        phone: z.string().min(1, { message: "Phone cannot be empty" }),
        position: z.string().min(1, { message: "Position cannot be empty" }),
        salary: z.number().min(0, { message: "Salary must be a positive number" }),
        outletId: z.number().min(1, { message: "Outlet ID is required" }),
    })
    static readonly UPDATE: ZodType = z.object({
        userId: z.number().min(1, { message: "User ID is required" }),
        firstName: z.string().min(1, { message: "First name cannot be empty" }),
        lastName: z.string().min(1, { message: "Last name cannot be empty" }),
        email: z.string().email({ message: "Invalid email address" }),
        phone: z.string().min(1, { message: "Phone cannot be empty" }),
        position: z.string().min(1, { message: "Position cannot be empty" }),
        salary: z.number().min(0, { message: "Salary must be a positive number" }),
        outletId: z.number().min(1, { message: "Outlet ID is required" }),
    })

}