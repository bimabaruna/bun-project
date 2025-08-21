
import { z } from "zod";

export class StockMovementValidation {
    static readonly CREATE = z.object({
        productId: z.number(),
        userId: z.number(),
        quantity: z.number(),
        movementType: z.string(),
        orderId: z.number().optional(),
        note: z.string().optional(),
    });

    static readonly GET = z.object({
        page: z.number().min(1).positive(),
        size: z.number().min(1).positive(),
        order_id: z.number().optional(),
        user_id: z.number().optional(),
        username: z.string().optional(),
        movement_type: z.string().optional(),
        product_id: z.number().optional(),
        product_name: z.string().optional(),
        created_at: z.date().optional(),
    });
}
