import type { Order } from "@prisma/client"
import type { Decimal } from "@prisma/client/runtime/library";

export type CreateOrderRequest = {
    items: OrderItems[]
}

export type OrderItems = {
    product_id: number;
    quantity: number;
}

export type OrderResponse = {
    id: number;
    customer_id: number;
    total_price: Decimal;
    items: OrderItems[]
}

export function toOrderResponse(order: Order & { 
    order_items: { 
        product_id: number; quantity: number 
    }[] 
}): OrderResponse {
    return {
        id: order.id,
        customer_id: order.customer_id,
        items: order.order_items.map(item => ({
            product_id: item.product_id, 
            quantity: item.quantity
        })),
        total_price: order.total_price
    }
}