import type { Payment } from "@prisma/client"
import type { Decimal } from "@prisma/client/runtime/library"

export type PaymentResponse = {
    id: number,
    message: string
}

export type PaymentRequest = {
    order_id: number,
    amount: Decimal,
    method: string
}

export function toPaymentResponse(payment: Payment){
    return{
        id: payment.id
    }
}