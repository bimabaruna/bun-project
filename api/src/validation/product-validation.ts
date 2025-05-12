import { z, ZodType } from "zod";


export class productValidation {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1, { message: 'Product name cannot be empty' }).max(100),
        price: z.number().int().positive({ message: 'Price must bigger than 0' }),
        quantity: z.number().int().positive({ message: 'Price must bigger than 0' }),
        categoryId: z.number().int(),
        outletId: z.number().int().optional()
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1, { message: 'Product name cannot be empty' }).max(100),
        price: z.number().int().positive({ message: 'Price must bigger than 0' }),
        quantity: z.number().int().positive({ message: 'Quantity must bigger than 0' }),
        outletId: z.number().int().optional()
    })

    static readonly GET: ZodType = z.number().positive()

    static readonly DELETE: ZodType = z.number().positive()

    static readonly CREATE_DATA_SCHEMA: ZodType = z.object({
        name: z.string().min(1, "Name is required").max(255), // Using max length from your example
        price: z.number().positive("Price must be positive"), // Allows float, use .int() if needed
        quantity: z.number().int().min(0, "Quantity cannot be negative"), // Allows 0 quantity
        categoryId: z.number().int().positive("Invalid Category ID").optional(), // OPTIONAL category ID
    })


}
export type ValidatedProductData = z.infer<typeof productValidation.CREATE_DATA_SCHEMA>;