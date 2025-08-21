import type { Order, Product, StockMovement, User } from "@prisma/client";

export type StockMovementResponse = {
    id: number;
    productId: number;
    productName?: string | null;
    userId: number;
    username?: string | null;
    quantity: number;
    movementType: string;
    orderId?: number | null;
    quantityChange: number;
    quanityAfter: number;
    note?: string | null;
    createdAt: Date;
}




