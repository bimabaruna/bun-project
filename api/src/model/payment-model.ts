import type { Payment } from "@prisma/client"
import type { Decimal } from "@prisma/client/runtime/library"

export type PaymentResponse = {
    id: number,
    message: string
}

export type PaymentRequest = {
    order_id: number,
    amount: Decimal,
    method: PaymentMethod
}

export enum PaymentMethod {
    PAYMENT_METHOD_CASH = "cash",
    PAYMENT_METHOD_TRANSFER = "transfer",
    PAYMENT_METHOD_CREDIT_CARD = "credit_card"
}

export function toPaymentResponse(payment: Payment) {
    return {
        id: payment.id
    }
}