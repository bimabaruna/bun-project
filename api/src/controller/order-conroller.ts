import { Hono } from "hono"
import type { ApplicationVatiables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";
import type { CreateOrderRequest } from "../model/order-model";
import { OrderService } from "../service/order-service";


export const orderController = new Hono<{ Variables: ApplicationVatiables }>()

orderController.use(authMiddleware)

orderController.post('/api/order', async (c) =>{
    const user = c.get('user') as User
    const request = await c.req.json() as CreateOrderRequest

    const response = await OrderService.create(user, request)

    return c.json({
        data: response
    })
})