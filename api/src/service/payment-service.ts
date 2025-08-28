import { prismaClient } from "../application/database";
import { Orderstatus, type User } from "@prisma/client";
import { paymentValidation } from "../validation/payment-validation";
import { HTTPException } from "hono/http-exception";
import { type PaymentRequest, type PaymentResponse } from "../model/payment-model";

export class PaymentService {
    static async create(user: User, request: PaymentRequest): Promise<PaymentResponse> {
        request = paymentValidation.CREATE.parse(request);

        const order = await prismaClient.order.findFirst({
            where: { id: request.order_id }
        });

        if (!order) {
            throw new HTTPException(400, {
                message: `order id ${request.order_id} not found`
            });
        }

        const paidableStatuses = [Orderstatus.on_progress.toString()];

        if (!paidableStatuses.includes(order.status)) {
            throw new HTTPException(400, {
                message: `Order cannot be paid in its current status: ${order.status}`
            });
        }

        // ✅ Wrap in transaction
        const [payment] = await prismaClient.$transaction([
            prismaClient.payment.create({
                data: {
                    order_id: request.order_id,
                    amount: request.amount,
                    method: request.method
                }
            }),
            prismaClient.order.update({
                where: { id: request.order_id },
                data: { status: Orderstatus.completed }
            })
        ]);

        return {
            id: payment.id,
            message: "Payment success, order has been paid!"
        };
    }
}
