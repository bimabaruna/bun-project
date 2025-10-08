import type { Order, OrderItem, Product, User } from "@prisma/client";

export type Bill = {
    order: Order & {
        order_items: (OrderItem & {
            product: Product;
        })[];
        user: User;
    };
};

export type BillResponse = {
    html: string;
    data: {
        order: {
            id: number;
            date: Date;
            status: string;
            items: Array<{
                product: string;
                quantity: number;
                price: number;
                total: number;
            }>;
        };
        outlet: {
            name: string;
            address: string;
            phone: string;
        };
        cashier: string;
        payment: {
            method: string;
            amount: number;
            status: string;
            date: Date;
        } | null;
        totals: {
            subtotal: number;
            tax: number;
            total: number;
            change: number;
        };
    };
};