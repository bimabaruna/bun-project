import type { Order, OrderItem, Product, User } from "@prisma/client";

export type Bill = {
    order: Order & {
        order_items: (OrderItem & {
            product: Product;
        })[];
        user: User;
    };
};