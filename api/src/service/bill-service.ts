import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import type { Bill, BillResponse } from "../model/bill-model";

export class BillService {

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
                payments: true
            },
        });

        if (!order) {
            throw new HTTPException(404, { message: "Order not found" });
        }

        return { order };
    }

    static async generatePOSBill(orderId: number): Promise<BillResponse> {
        const order = await prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
                payments: true
            },
        });

        if (!order) {
            throw new HTTPException(404, { message: "Order not found" });
        }

        // Get outlet information from the user's employee details
        const employeeDetails = await prismaClient.product.findUnique({
            where: { id: order.cashier_id },
            include: {
                outlet: true
            }
        });

        if (!employeeDetails) {
            throw new HTTPException(404, { message: "Employee details not found" });
        }

        const outlet = employeeDetails.outlet;

        // Calculate subtotal and tax
        const subtotal = Number(order.total_price);
        const taxRate = 0.1; // 10% tax
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;

        // Format payment information
        const paymentInfo = order.payments && order.payments.length > 0 && order.payments[0]
            ? {
                method: order.payments[0].method ?? 'cash',
                amount: Number(order.payments[0].amount ?? 0),
                status: order.payments[0].status ?? 'unpaid',
                date: order.payments[0].payment_date ?? new Date()
            }
            : null;

        const change = paymentInfo && paymentInfo.amount > total
            ? paymentInfo.amount - total
            : 0;

        // Generate HTML receipt
        const htmlReceipt = this.generatePOSHtml(order, outlet, {
            subtotal,
            taxRate,
            taxAmount,
            total,
            paymentInfo,
            change
        });

        // Return both HTML and structured data for frontend consumption
        return {
            html: htmlReceipt,
            data: {
                order: {
                    id: order.id,
                    date: order.order_date,
                    status: order.status,
                    items: order.order_items.map(item => ({
                        product: item.product.name,
                        quantity: item.quantity,
                        price: Number(item.price_at_order),
                        total: item.quantity * Number(item.price_at_order)
                    }))
                },
                outlet: {
                    name: outlet?.outlet_name ?? '',
                    address: outlet?.address ?? '',
                    phone: outlet?.phone ?? ''
                },
                cashier: order.user.name,
                payment: paymentInfo,
                totals: {
                    subtotal,
                    tax: taxAmount,
                    total,
                    change
                }
            }
        };
    }

    private static generatePOSHtml(order: any, outlet: any, financials: any): string {
        const { total } = financials;

        const formatCurrency = (amount: number) => new Intl.NumberFormat("id-ID").format(amount);
        const formatDate = (date: Date) => new Date(date).toLocaleString("id-ID");

        return `<!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <style>
            body{font-family:'Courier New',monospace;font-size:12px;margin:0;padding:0;}
            .bill-content{width:76mm;margin:0 auto;}
            .separator{border-top:1px dashed #000;margin:8px 0;}
            .flex{display:flex;justify-content:space-between;}
            .text-center{text-align:center;}
            .font-bold{font-weight:bold;}
            .font-semibold{font-weight:600;}
            .text-lg{font-size:16px;}
            .text-base{font-size:14px;}
            .text-xs{font-size:10px;}
            .pl-2{padding-left:8px;}
            .uppercase{text-transform:uppercase;}
            .space-y-1>*+*{margin-top:4px;}
            .space-y-2>*+*{margin-top:8px;}
            .space-y-3>*+*{margin-top:12px;}
            </style>
            </head>
            <body>
            <div id="printable-bill" class="bill-content space-y-3 text-sm font-mono">
            <div class="text-center space-y-1">
            <h2 class="text-lg font-bold">${outlet.outlet_name}</h2>
            <p class="text-xs">${outlet.address}</p>
            <p class="text-xs">${outlet.phone}</p>
            </div>
            <div class="separator"></div>
            <div class="space-y-1 text-xs">
            <div class="flex"><span>Order #:</span><span class="font-semibold">${order.id}</span></div>
            <div class="flex"><span>Date:</span><span>${formatDate(order.order_date)}</span></div>
            <div class="flex"><span>Cashier:</span><span>${order.user.name}</span></div>
            <div class="flex"><span>Status:</span><span class="uppercase">${order.status}</span></div>
            </div>
            <div class="separator"></div>
            <div class="space-y-2">
            ${order.order_items.map((item: any) => {
            const itemTotal = item.quantity * Number(item.price_at_order);
            return `<div class=\"space-y-1\">
                <div class=\"flex font-semibold\"><span>${item.product.name}</span></div>
                <div class=\"flex text-xs pl-2\">
                    <span>${item.quantity} x Rp. ${formatCurrency(item.price_at_order)}</span>
                    <span>Rp. ${formatCurrency(itemTotal)}</span>
                </div>
                </div>`;
        }).join('')}
            </div>
            <div class="separator"></div>
            <div class="space-y-1">
            <div class="flex text-base font-bold"><span>TOTAL:</span><span>Rp. ${formatCurrency(total)}</span></div>
            </div>
            <div class="separator"></div>
            <div class="text-center text-xs space-y-1">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
            </div>
            </div>
            </body>
            </html>`;
    }
}