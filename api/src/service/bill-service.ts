import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import type { Bill } from "../model/bill-model";

export class BillService {

    static async generateBill(orderId: number): Promise<string> {
        const order = await prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if (!order) {
            throw new HTTPException(404, { message: "Order not found" });
        }

        return this.generateHtml(order);
    }

    static async getBillData(orderId: number): Promise<Bill> {
        const order = await prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if (!order) {
            throw new HTTPException(404, { message: "Order not found" });
        }

        return { order };
    }

    private static generateHtml(order: any): string {
        const orderItemsHtml = order.order_items.map((item: any) => `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price_at_order}</td>
                <td>${item.quantity * item.price_at_order}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bill for Order #${order.id}</title>
                <style>
                    body { font-family: sans-serif; }
                    .container { width: 300px; margin: 0 auto; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .total { font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Order #${order.id}</h1>
                    <p>Cashier: ${order.user.name}</p>
                    <p>Date: ${new Date(order.order_date).toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHtml}
                        </tbody>
                    </table>
                    <p class="total">Total: ${order.total_price}</p>
                </div>
            </body>
            </html>
        `;
    }
}