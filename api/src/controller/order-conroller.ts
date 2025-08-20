import { Hono } from "hono"
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";
import type { CreateOrderRequest } from "../model/order-model";
import { OrderService } from "../service/order-service";


export const orderController = new Hono<{ Variables: ApplicationVariables }>()

// orderController.use(authMiddleware)

orderController.post('/order', authMiddleware, async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as CreateOrderRequest

    const response = await OrderService.create(user, request)

    return c.json({
        data: response
    })
})

orderController.get('/order/:id', authMiddleware, async (c) => {
    const user = c.get('user') as User
    const request = c.req.param('id')

    const response = await OrderService.getById(user, request)

    return c.json({
        data: response
    })
})

orderController.post('/order/:id/cancel', authMiddleware, async (c) => {

    const user = c.get('user') as User
    const request = Number(c.req.param('id'))

    const response = await OrderService.cancel(user, request)

    return c.json({
        data: response
    })

})

orderController.get('/order', authMiddleware, async (c) => {
    const { page, size, startDate, endDate } = c.req.query();

    const pageNumber = page ? parseInt(page, 10) : 1;
    const sizeNumber = size ? parseInt(size, 10) : 10;

    const response = await OrderService.getList(pageNumber, sizeNumber, startDate, endDate);

    return c.json(response);
});

orderController.post('/v2/order', authMiddleware, async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as CreateOrderRequest

    const response = await OrderService.createV2(user, request)

    return c.json({
        data: response
    })
})

orderController.post('/v2/order/:id/cancel', authMiddleware, async (c) => {

    const user = c.get('user') as User
    const request = Number(c.req.param('id'))

    const response = await OrderService.cancelV2(user, request)

    return c.json({
        data: response
    })

})
