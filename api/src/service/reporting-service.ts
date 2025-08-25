import { prismaClient } from "../application/database";
import type { Order } from "@prisma/client";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export class ReportingService {
    static async getOrdersPerDay(range: DateRange

    ): Promise<{ date: string; orderCount: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);

            const dailyOrders = await prismaClient.order.groupBy({
                by: ['order_date'],
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _count: { id: true },
                orderBy: { order_date: 'asc' },
            });

            // Force TypeScript to see `date` as always a string
            const orderMap: Record<string, number> = {};

            dailyOrders.forEach(day => {
                const dateKey = (day.order_date ?? new Date(0)).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
                orderMap[dateKey] = (orderMap[dateKey] ?? 0) + day._count.id;
            });

            const formattedResult = Object.entries(orderMap).map(([date, orderCount]) => ({
                date,
                orderCount,
            }));

            return formattedResult;
        } catch (error) {
            console.error("Error fetching daily order report:", error);
            throw new Error("Could not generate the daily orders report.");
        }
    }


    /**
     * Finds the most sold products within a given date range, ranked by quantity.
     * @param {DateRange} range - The start and end date for the report.
     * @param {number} [limit=10] - The maximum number of products to return.
     * @returns {Promise<Array<{ productId: number; productName: string; totalQuantitySold: number }>>} A ranked list of the top-selling products.
     */
    static async getMostSoldProducts(range: DateRange, limit: number = 10): Promise<{ productId: number; productName: string; totalQuantitySold: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);
            // We need to group the OrderItem table and sum the quantities.
            const topProducts = await prismaClient.orderItem.groupBy({
                by: ['product_id'],
                where: {
                    // Filter by the order's date using the relation.
                    order: {
                        order_date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                // Sum the quantity for each product group.
                _sum: {
                    quantity: true,
                },
                // Order the groups by the summed quantity in descending order.
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                // Limit the number of results.
                take: limit,
            });

            if (topProducts.length === 0) {
                return [];
            }

            // The result above only gives us product_id and the sum.
            // We need another query to get the product names for these IDs.
            const productIds = topProducts.map(p => p.product_id);

            const products = await prismaClient.product.findMany({
                where: {
                    id: {
                        in: productIds,
                    },
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            // Create a quick lookup map for product names.
            const productNameMap = new Map(products.map(p => [p.id, p.name]));

            // Combine the aggregated data with the product names.
            const finalResult = topProducts.map(item => ({
                productId: item.product_id,
                productName: productNameMap.get(item.product_id) || 'Unknown Product',
                totalQuantitySold: item._sum.quantity || 0,
            }));

            return finalResult;

        } catch (error) {
            console.error("Error fetching most sold products report:", error);
            throw new Error("Could not generate the most sold products report.");
        }
    }

    /**
     * NEW: Calculates the total revenue for each day within a given date range.
     * @param {DateRange} range - The start and end date for the report.
     * @returns {Promise<Array<{ date: string; totalRevenue: number }>>} A list of objects, each containing a date and the total revenue.
     */
    static async getRevenuePerDay(range: DateRange): Promise<{ date: string; totalRevenue: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);

            const dailyRevenue = await prismaClient.order.groupBy({
                by: ['order_date'],
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _sum: {
                    total_price: true, // Sum the total_price for each day.
                },
                orderBy: {
                    order_date: 'asc',
                },
            });

            // Format the result, converting Prisma's Decimal to a number.
            const revenueMap: Record<string, number> = {};

            dailyRevenue.forEach(day => {
                const dateKey = (day.order_date ?? new Date(0)).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
                revenueMap[dateKey] = (revenueMap[dateKey] ?? 0) + (day._sum.total_price?.toNumber() || 0);
            });

            const formattedResult = Object.entries(revenueMap).map(([date, totalRevenue]) => ({
                date,
                totalRevenue,
            }));

            return formattedResult;
        } catch (error) {
            console.error("Error fetching daily revenue report:", error);
            throw new Error("Could not generate the daily revenue report.");
        }
    }

    /**
     * NEW: Ranks cashiers by total sales revenue within a given date range.
     * @param {DateRange} range - The start and end date for the report.
     * @param {number} [limit=10] - The maximum number of cashiers to return.
     * @returns {Promise<Array<{ cashierId: number; cashierName: string; totalRevenue: number; totalOrders: number }>>} A ranked list of top-performing cashiers.
     */
    static async getSalesByCashier(range: DateRange, limit: number = 10): Promise<{ cashierId: number; cashierName: string; totalRevenue: number; totalOrders: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);

            const cashierPerformance = await prismaClient.order.groupBy({
                by: ['cashier_id'],
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _sum: {
                    total_price: true,
                },
                _count: {
                    id: true,
                },
                orderBy: {
                    _sum: {
                        total_price: 'desc',
                    },
                },
                take: limit,
            });

            if (cashierPerformance.length === 0) {
                return [];
            }

            // Get cashier names for the resulting IDs
            const cashierIds = cashierPerformance.map(c => c.cashier_id);
            const cashiers = await prismaClient.user.findMany({
                where: {
                    id: { in: cashierIds },
                },
                select: { id: true, name: true }, // Assuming the User model has a 'name' field
            });
            const cashierNameMap = new Map(cashiers.map(c => [c.id, c.name]));

            // Combine the data
            const finalResult = cashierPerformance.map(perf => ({
                cashierId: perf.cashier_id,
                cashierName: cashierNameMap.get(perf.cashier_id) || 'Unknown Cashier',
                totalRevenue: perf._sum.total_price?.toNumber() || 0,
                totalOrders: perf._count.id,
            }));

            return finalResult;
        } catch (error) {
            console.error("Error fetching sales by cashier report:", error);
            throw new Error("Could not generate the sales by cashier report.");
        }
    }

    static async getOrderEachDay(
        range: DateRange
    ): Promise<{ date: string; orderCount: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);

            const dailyOrders = await prismaClient.order.groupBy({
                by: ['order_date'],
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _count: { id: true },
                orderBy: { order_date: 'asc' },
            });

            // Map DB results into { date -> orderCount }
            const orderMap: Record<string, number> = {};
            dailyOrders.forEach(day => {
                const dateKey = (day.order_date ?? new Date(0)).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
                orderMap[dateKey] = (orderMap[dateKey] ?? 0) + day._count.id;
            });

            // Generate all dates between start and end
            const result: { date: string; orderCount: number }[] = [];
            let current = new Date(range.startDate);
            const end = new Date(range.endDate);

            while (current <= end) {
                const dateKey = current.toISOString().slice(0, 10);
                result.push({
                    date: dateKey,
                    orderCount: orderMap[dateKey] ?? 0,
                });
                current.setDate(current.getDate() + 1);
            }

            return result;
        } catch (error) {
            console.error("Error fetching daily order report:", error);
            throw new Error("Could not generate the daily orders report.");
        }
    }


    static async getRevenueEachDay(
        range: DateRange
    ): Promise<{ date: string; totalRevenue: number }[]> {
        try {
            const startDate = new Date(`${range.startDate}T00:00:00.000Z`);
            const endDate = new Date(`${range.endDate}T23:59:59.999Z`);

            const dailyRevenue = await prismaClient.order.groupBy({
                by: ['order_date'],
                where: {
                    order_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _sum: { total_price: true },
                orderBy: { order_date: 'asc' },
            });

            // Map DB results into { date -> totalRevenue }
            const revenueMap: Record<string, number> = {};
            dailyRevenue.forEach(day => {
                const dateKey = (day.order_date ?? new Date(0)).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
                revenueMap[dateKey] = (revenueMap[dateKey] ?? 0) + (day._sum.total_price?.toNumber() || 0);
            });

            // Generate all dates between start and end
            const result: { date: string; totalRevenue: number }[] = [];
            let current = new Date(range.startDate);
            const end = new Date(range.endDate);

            while (current <= end) {
                const dateKey = current.toISOString().slice(0, 10);
                result.push({
                    date: dateKey,
                    totalRevenue: revenueMap[dateKey] ?? 0,
                });
                current.setDate(current.getDate() + 1);
            }

            return result;
        } catch (error) {
            console.error("Error fetching daily revenue report:", error);
            throw new Error("Could not generate the daily revenue report.");
        }
    }

    static async getTodaySalesStatistic(): Promise<{ title: string; value: string; change: string; trend: 'up' | 'down' | 'flat' }> {
        try {
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

            const todaySalesResult = await prismaClient.order.aggregate({
                _sum: {
                    total_price: true,
                },
                where: {
                    order_date: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                },
            });
            const todaySales = todaySalesResult._sum.total_price?.toNumber() || 0;

            const yesterdaySalesResult = await prismaClient.order.aggregate({
                _sum: {
                    total_price: true,
                },
                where: {
                    order_date: {
                        gte: yesterdayStart,
                        lte: yesterdayEnd,
                    },
                },
            });
            const yesterdaySales = yesterdaySalesResult._sum.total_price?.toNumber() || 0;

            let change = "0.0%";
            let trend: 'up' | 'down' | 'flat' = 'flat';

            if (yesterdaySales > 0) {
                const percentageChange = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
                if (percentageChange > 0) {
                    trend = 'up';
                    change = `+${percentageChange.toFixed(1)}%`;
                } else if (percentageChange < 0) {
                    trend = 'down';
                    change = `${percentageChange.toFixed(1)}%`;
                } else {
                    trend = 'flat';
                    change = '0.0%';
                }
            } else if (todaySales > 0) {
                trend = 'up';
                change = '+100.0%';
            }

            return {
                title: "Today's Sales",
                value: todaySales.toString(),
                change: change,
                trend: trend,
            };

        } catch (error) {
            console.error("Error fetching today's sales statistic:", error);
            throw new Error("Could not generate today's sales statistic.");
        }
    }

    static async getTodayOrdersStatistic(): Promise<{ title: string; value: string; change: string; trend: 'up' | 'down' | 'flat' }> {
        try {
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

            const todayOrders = await prismaClient.order.count({
                where: {
                    order_date: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                },
            });

            const yesterdayOrders = await prismaClient.order.count({
                where: {
                    order_date: {
                        gte: yesterdayStart,
                        lte: yesterdayEnd,
                    },
                },
            });

            let change = "0.0%";
            let trend: 'up' | 'down' | 'flat' = 'flat';

            if (yesterdayOrders > 0) {
                const percentageChange = ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100;
                if (percentageChange > 0) {
                    trend = 'up';
                    change = `+${percentageChange.toFixed(1)}%`;
                } else if (percentageChange < 0) {
                    trend = 'down';
                    change = `${percentageChange.toFixed(1)}%`;
                } else {
                    trend = 'flat';
                    change = '0.0%';
                }
            } else if (todayOrders > 0) {
                trend = 'up';
                change = '+100.0%';
            }

            return {
                title: "Orders",
                value: todayOrders.toString(),
                change: change,
                trend: trend,
            };

        } catch (error) {
            console.error("Error fetching today's orders statistic:", error);
            throw new Error("Could not generate today's orders statistic.");
        }
    }

    static async getTodayProductsSelledStatistic(): Promise<{ title: string; value: string; change: string; trend: 'up' | 'down' | 'flat' }> {
        try {
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

            const todayProductsSelledResult = await prismaClient.orderItem.aggregate({
                _sum: {
                    quantity: true,
                },
                where: {
                    order: {
                        order_date: {
                            gte: todayStart,
                            lte: todayEnd,
                        },
                    },
                },
            });
            const todayProductsSelled = todayProductsSelledResult._sum.quantity || 0;

            const yesterdayProductsSelledResult = await prismaClient.orderItem.aggregate({
                _sum: {
                    quantity: true,
                },
                where: {
                    order: {
                        order_date: {
                            gte: yesterdayStart,
                            lte: yesterdayEnd,
                        },
                    },
                },
            });
            const yesterdayProductsSelled = yesterdayProductsSelledResult._sum.quantity || 0;

            let change = "0.0%";
            let trend: 'up' | 'down' | 'flat' = 'flat';

            if (yesterdayProductsSelled > 0) {
                const percentageChange = ((todayProductsSelled - yesterdayProductsSelled) / yesterdayProductsSelled) * 100;
                if (percentageChange > 0) {
                    trend = 'up';
                    change = `+${percentageChange.toFixed(1)}%`;
                } else if (percentageChange < 0) {
                    trend = 'down';
                    change = `${percentageChange.toFixed(1)}%`;
                } else {
                    trend = 'flat';
                    change = '0.0%';
                }
            } else if (todayProductsSelled > 0) {
                trend = 'up';
                change = '+100.0%';
            }

            return {
                title: "Products selling today",
                value: todayProductsSelled.toString(),
                change: change,
                trend: trend,
            };

        } catch (error) {
            console.error("Error fetching today's products selled statistic:", error);
            throw new Error("Could not generate today's products selled statistic.");
        }
    }
}