import { add } from "winston";
import { z, ZodType } from "zod";

export class outletValidation {

    static readonly CREATE: ZodType = z.object({
        outletName: z.string().min(1),
        outletAddress: z.string().min(1),
        phone: z.string().min(1),

    })

    static readonly UPDATE: ZodType = z.object({
        outletName: z.string().min(1),
        outletAddress: z.string().min(1),
        phone: z.string().min(1),

    })

    static readonly DELETE: ZodType = z.object({
        id: z.number().positive()
    })

}