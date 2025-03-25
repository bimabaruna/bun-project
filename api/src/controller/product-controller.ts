import { Hono } from "hono"
import type { ApplicationVatiables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";



export const productController = new Hono<{ Variables: ApplicationVatiables }>()

productController.use(authMiddleware)

productController.post('/api/products', async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as CreateProductRequest

    const response = await ProductService.create(user, request)

    return c.json({
        data: response
    })
})

productController.get('/api/products', async (c) => {

    const size = Number(c.req.header('size'))
    const page = Number(c.req.header('page'))

    const response = await ProductService.getList(page, size)
    console.log(response);
    return c.json(response)
})