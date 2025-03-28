import { z, ZodType } from "zod";

export class orderValidation {

    static readonly CREATE: ZodType = z.object({
        items: z.array(
            z.object({
                product_id: z.number(),
                quantity: z.number().positive()
            })
        )
    })
}