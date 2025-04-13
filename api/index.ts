import { Hono } from "hono";
import { userController } from "./src/controller/user-conroller";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { contactController } from "./src/controller/contact-controller";
import { productController } from "./src/controller/product-controller";
import { orderController } from "./src/controller/order-conroller";
import { paymentController } from "./src/controller/payment-controller";
import { serveStatic } from "hono/bun";
import dotenv from "dotenv";
import { cors } from "hono/cors";

const app = new Hono()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // Default to 'development' if not set
dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
});

console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

app.use('*', cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
}))

app.get('/', (c) => {
    return c.text('hello')
})

app.route('/', userController)
app.route('/', contactController)
app.route('/', productController)
app.route('/', orderController)
app.route('/', paymentController)

// app.use('*', serveStatic({ root: './frontend/dist' }));
// app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

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