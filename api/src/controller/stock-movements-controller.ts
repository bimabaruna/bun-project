
import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { StockMovementsService } from "../service/stock-movements-service";
import type { User } from "@prisma/client";

export const stockMovementController = new Hono<{ Variables: ApplicationVariables }>();

stockMovementController.get("/stock-movements", authMiddleware, async (c) => {
    const page = c.req.query("page")
    const size = c.req.query("size")
    const orderId = c.req.query("orderId")
    const productName = c.req.query("productName")
    const user = c.get('user') as User

    const response = await StockMovementsService.getList(
        Number(page) || 1,
        Number(size) || 10,
        orderId ? Number(orderId) : undefined,
        productName ? String(productName) : undefined
    );
    return c.json(response)
});
