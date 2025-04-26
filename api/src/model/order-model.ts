import type { Order } from "@prisma/client"
import type { Decimal } from "@prisma/client/runtime/library";

export type CreateOrderRequest = {
    items: OrderItems[]
}

export type OrderItems = {
    product_id: number;
    quantity: number;
    product_name: string
}

export type OrderResponse = {
    id: number;
    customer_id: number;
    total_price: Decimal;
    status: string
    items: OrderItems[]
}

export function toOrderResponse(order: Order & {
    order_items: {
        product_id: number; quantity: number; product: { name: string }
    }[]
}): OrderResponse {
    return {
        id: order.id,
        customer_id: order.cashier_id,
        status: order.status,
        items: order.order_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product_name: item.product.name
        })),
        total_price: order.total_price
    }
}