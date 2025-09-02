import { authMiddleware } from "../middleware/auth-middleware"
import { Hono } from "hono";
import { type ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import type { PaymentRequest } from "../model/payment-model";
import { PaymentService } from "../service/payment-service";

export const paymentController = new Hono<{ Variables: ApplicationVariables }>()

// paymentController.use(authMiddleware)

paymentController.post('/payment', authMiddleware, async (c) => {

    const user = c.get('user') as User
    const request = await c.req.json() as PaymentRequest

    const response = await PaymentService.create(user, request)

    return c.json({
        data: response
    })
})

paymentController.get('/payment', authMiddleware, async (c) => {
    const response = await PaymentService.getList()

    return c.json(response)
})