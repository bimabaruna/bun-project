import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { BillService } from "../service/bill-service";

export const billController = new Hono<{ Variables: ApplicationVariables }>();


billController.get('/bill/:orderId/json', authMiddleware, async (c) => {
    const orderId = c.req.param('orderId');
    const bill = await BillService.getBillData(Number(orderId));
    return c.json(bill);
});

//with json
billController.get('/bill/:orderId/pos', authMiddleware, async (c) => {
    const orderId = c.req.param('orderId');
    const posBill = await BillService.generatePOSBill(Number(orderId));
    return c.json(posBill);
});

billController.get('/bill/:orderId/pos/html', authMiddleware, async (c) => {
    const orderId = c.req.param('orderId');
    const posBill = await BillService.generatePOSBill(Number(orderId));
    c.header('Content-Type', 'text/html');
    return c.body(posBill.html);
});