import type { User } from '@prisma/client';
import { productValidation } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { use } from "react";
import { date } from "zod";
import { HTTPException } from "hono/http-exception";
import { toPaymentResponse, type PaymentRequest, type PaymentResponse } from '../model/payment-model';
import { paymentValidation } from '../validation/payment-validation';

export class PaymentService {

    static async create(user: User, request: PaymentRequest): Promise<PaymentResponse> {

        request = paymentValidation.CREATE.parse(request)

        const order = await prismaClient.order.findFirst({
            where: {
                id: request.order_id
            }
        })

        if (!order) {
            throw new HTTPException(400, {
                message: `order id ${request.order_id} not found`
            })
        }

        const paidableStatuses = ["on_progress"];

        if (!paidableStatuses.includes(order.status)) {
            throw new HTTPException(400, {
                message: `Order cannot be paid in its current status: ${order.status}`
            })
        }

        const payment = await prismaClient.payment.create({
            data: {
                order_id: request.order_id,
                amount: request.amount,
                method: request.method
            }
        })

        await prismaClient.order.update({
            where: {
                id: request.order_id
            }, data: {
                status: "paid"
            }
        })

        return {
            id: payment.id,
            message: 'Payment success, order has been paid!'
        }

    }
}