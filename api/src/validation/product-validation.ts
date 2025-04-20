import { z, ZodType } from "zod";


export class productValidation  {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1,{message: 'Product name cannot be empty'}).max(100),
        price: z.number().int().positive({message: 'Price must bigger than 0'}),
        quantity: z.number().int().positive({message: 'Price must bigger than 0'}),
        categoryId: z.number().int()
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1,{message: 'Product name cannot be empty'}).max(100),
        price: z.number().int().positive({message: 'Price must bigger than 0'}),
        quantity: z.number().int().positive({message: 'Quantity must bigger than 0'}) 
    })

    static readonly GET: ZodType = z.number().positive()

    static readonly DELETE : ZodType = z.number().positive()
}