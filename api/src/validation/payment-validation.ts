import { number, z, ZodType } from "zod";

export class paymentValidation {

    static readonly CREATE: ZodType = z.object({   
        order_id: z.number().positive(),
        amount: z.number(),
        method: z.string()
            
    })
    static readonly CANCEL: ZodType = z.number().positive()

}