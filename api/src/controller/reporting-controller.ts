import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { ReportingService } from "../service/reporting-service";
import type { DateRange } from "../service/reporting-service";

export const reportingController = new Hono<{ Variables: ApplicationVariables }>()

reportingController.use('/*', authMiddleware)

reportingController.post('/reports/orders-per-day', async (c) => {
    const range = await c.req.json() as DateRange;
    const response = await ReportingService.getOrdersPerDay(range);
    return c.json({ data: response });
});

reportingController.post('/reports/most-sold-products', async (c) => {
    const { range, limit } = await c.req.json() as { range: DateRange, limit?: number };
    const response = await ReportingService.getMostSoldProducts(range, limit);
    return c.json({ data: response });
});

reportingController.post('/reports/revenue-per-day', async (c) => {
    const range = await c.req.json() as DateRange;
    const response = await ReportingService.getRevenuePerDay(range);
    return c.json({ data: response });
});

reportingController.post('/reports/sales-by-cashier', async (c) => {
    const { range, limit } = await c.req.json() as { range: DateRange, limit?: number };
    const response = await ReportingService.getSalesByCashier(range, limit);
    return c.json({ data: response });
});

reportingController.post('/reports/orders-each-day', async (c) => {
    const range = await c.req.json() as DateRange;
    const response = await ReportingService.getOrderEachDay(range);
    return c.json({ data: response });
});

reportingController.post('/reports/revenue-each-day', async (c) => {
    const range = await c.req.json() as DateRange;
    const response = await ReportingService.getRevenueEachDay(range);
    return c.json({ data: response });
});

reportingController.get('/reports/today-sales-statistic', async (c) => {
    const response = await ReportingService.getTodaySalesStatistic();
    return c.json({ data: response });
});

reportingController.get('/reports/today-orders-statistic', async (c) => {
    const response = await ReportingService.getTodayOrdersStatistic();
    return c.json({ data: response });
});


reportingController.get('/reports/today-products-statistic', async (c) => {
    const response = await ReportingService.getTodayProductsSelledStatistic();
    return c.json({ data: response });
});