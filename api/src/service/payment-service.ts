import { prismaClient } from "../application/database";
import { Orderstatus, PaymentStatus, type User } from "@prisma/client";
import { paymentValidation } from "../validation/payment-validation";
import { HTTPException } from "hono/http-exception";
import { type PaymentListResponse, type PaymentRequest, type PaymentResponse } from "../model/payment-model";

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
                    method: request.method,
                    status: PaymentStatus.paid
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

    static async getList(): Promise<PaymentListResponse> {
        const payment = await prismaClient.payment.findMany({})

        const mapped = payment.map((payments) => {
            return {
                id: payments.id,
                order_id: payments.order_id,
                paymet_date: payments.payment_date,
                amount: payments.amount,
                method: payments.method,
                status: payments.status
            }
        })

        return { data: mapped }
    }
}
