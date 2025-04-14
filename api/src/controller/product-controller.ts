import { Hono } from "hono"
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";
import { date, number } from "zod";



export const productController = new Hono<{ Variables: ApplicationVariables }>()

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

    const size = Number(c.req.query('size'))
    const page = Number(c.req.query('page'))
    const product_name = c.req.query('productName')

    const response = await ProductService.getList(page, size, product_name)
    console.log(response);
    return c.json(response)
})

productController.patch('api/products/:id', async (c) => {

    const user = c.get('user') as User
    const product_id = c.req.param('id')
    const request = await c.req.json() as UpdateProductRequest
    const response = await ProductService.update(product_id, request, user)

    return c.json({
        data: response
    })
})

productController.get('/api/products/:id', async (c) => {
    const product_id = Number(c.req.param('id'))
    const response = await ProductService.get(product_id)

    return c.json({
        data: response
    })
})

productController.delete('/api/products/:id', async (c) => {
    const product_id = Number(c.req.param('id'))
    const response = await ProductService.delete(product_id)

    return c.json({
        data: response
    })
})