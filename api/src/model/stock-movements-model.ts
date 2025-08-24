import type { Order, Product, StockMovement, User } from "@prisma/client";


export type stockMovementListResponse = {
    page: number;
    size: number;
    totalCount: number;
    lastPage: number;
    data: StockMovementResponse[];
}
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





