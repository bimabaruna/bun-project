import { z, ZodType } from "zod";


export class productValidation  {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        price: z.number().int(),
        quantity: z.number().int().positive()
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        price: z.number().int(),
        quantity: z.number().int().positive() 
    })

    static readonly GET: ZodType = z.number().positive()

    static readonly DELETE : ZodType = z.number().positive()
}