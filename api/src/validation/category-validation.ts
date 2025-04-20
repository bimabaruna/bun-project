import { z, type ZodType } from "zod";


export class CategoryValidation {

    static readonly CREATE: ZodType = z.object({
        categoryName: z.string().min(1,{message: 'Category name cannot be empty'})

    })

    static readonly UPDATE: ZodType = z.object({
        categoryName: z.string().min(1,{message: 'Category name cannot be empty'})

    })

    static readonly DELETE: ZodType = z.number().min(1)
}