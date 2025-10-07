import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { BillService } from "../service/bill-service";

export const billController = new Hono<{ Variables: ApplicationVariables }>();

billController.get('/bill/:orderId', authMiddleware, async (c) => {
    const orderId = c.req.param('orderId');
    const bill = await BillService.generateBill(Number(orderId));
    c.header('Content-Type', 'text/html');
    return c.body(bill);
});

billController.get('/bill/:orderId/json', authMiddleware, async (c) => {
    const orderId = c.req.param('orderId');
    const bill = await BillService.getBillData(Number(orderId));
    return c.json(bill);
});