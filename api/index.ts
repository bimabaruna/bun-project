import { Hono } from "hono";
import { userController } from "./src/controller/user-conroller";
import { error } from "winston";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { contactController } from "./src/controller/contact-controller";
import { productController } from "./src/controller/product-controller";
import { orderController } from "./src/controller/order-conroller";
import { paymentController } from "./src/controller/payment-controller";


const app = new Hono()

app.get('/', (c) => {
    return c.text('hello')
})

app.route('/', userController)
app.route('/', contactController)
app.route('/', productController)
app.route('/', orderController)
app.route('/', paymentController)

app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
        c.status(err.status)
        return c.json({
            errors: err.message
        })
    } else if (err instanceof ZodError) {
        c.status(400)
        return c.json({
            errors: err.message
        })
    } else {
        c.status(500)
        return c.json({
            errors: err.message
        })
    }
})

export default app