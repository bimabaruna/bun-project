import type { User } from '@prisma/client';
import { Orderstatus, StockMovementType } from '@prisma/client';
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { toOrderResponse, type CreateOrderRequest, type OrderListResponse, type OrderResponse } from "../model/order-model";
import { Decimal } from "@prisma/client/runtime/library";
import { orderValidation } from "../validation/order-validation";

export class OrderService {

    static async create(user: User, request: CreateOrderRequest): Promise<OrderResponse> {

        request = orderValidation.CREATE.parse(request);

        // Use transaction for atomicity
        return prismaClient.$transaction(async (prisma) => {
            let totalPrice = 0;
            const orderItems: {
                product: { connect: { id: number } };
                quantity: number;
                price_at_order: Decimal;
            }[] = [];

            // Process all items first without DB updates
            for (const { product_id, quantity } of request.items) {

                const product = await prisma.product.findUnique({
                    where: { id: product_id }
                });

                if (!product) {
                    throw new HTTPException(400, { message: `Product with id ${product_id} not found` });
                }

                if (product.quantity < quantity) {
                    throw new HTTPException(400, {
                        message: `Insufficient stock for product ${product_id}. Available: ${product.quantity}, Requested: ${quantity}`
                    });
                }

                totalPrice += Number(product.price) * quantity;
                orderItems.push({
                    product: { connect: { id: product_id } },
                    quantity,
                    price_at_order: product.price
                });
            }

            await Promise.all(request.items.map(({ product_id, quantity }) =>
                prisma.product.update({
                    where: { id: product_id },
                    data: { quantity: { decrement: quantity } }
                })
            ));

            // Create order
            const order = await prisma.order.create({
                data: {
                    cashier_id: user.id,
                    total_price: totalPrice,
                    status: "on_progress",
                    order_items: {
                        create: orderItems
                    }
                },
                include: {
                    order_items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return toOrderResponse(order);
        });
    }

    static async getById(user: User, id: string): Promise<OrderResponse> {

        const order = await prismaClient.order.findFirst({
            where: {
                id: Number(id)
            }, include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!order) {
            throw new HTTPException(400, {
                message: "product not exist"
            })
        }

        return {
            id: Number(order.id),
            cashier_id: user.id,
            total_price: order.total_price,
            status: order.status,
            items: order.order_items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                product_name: item.product.name,
                order_items_id: item.id,
                price_at_order: item.price_at_order
            }))

        }
    }
    static async cancel(user: User, id: number): Promise<{}> {
        id = orderValidation.CANCEL.parse(id)

        const order = await prismaClient.order.findFirst({
            where: {
                id: id
            }, include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }

        })

        if (!order) {
            throw new HTTPException(400, {
                message: "Order not found"
            })
        }

        const cancellableStatuses = ["on_progress", "pending_payment"];

        if (!cancellableStatuses.includes(order.status)) {
            throw new HTTPException(400, {
                message: `Order cannot be cancelled in its current status: ${order.status}`
            })
        }

        await Promise.all(order.order_items.map(item =>
            prismaClient.product.update({
                where: {
                    id: item.product.id
                }, data: {
                    quantity: { increment: item.quantity }
                }
            })
        ))

        await prismaClient.order.update({
            where: {
                id: order.id
            },
            data: {
                status: Orderstatus.cancelled
            }, include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return {
            id: order.id,
            message: "Order are Canceled"
        }
    }

    static async getList(page: number, size: number, startDate?: string, endDate?: string): Promise<
        OrderListResponse> {

        const pageNumber = Math.max(1, page);
        const skip = (pageNumber - 1) * size;

        const where: any = {};
        if (startDate || endDate) {
            where.order_date = {};
            if (startDate) {
                where.order_date.gte = new Date(startDate);
            }
            if (endDate) {
                where.order_date.lte = new Date(endDate);
            }
        }

        const [orders, totalCount] = await Promise.all([
            prismaClient.order.findMany({
                where,
                skip,
                take: size,
                include: {
                    order_items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    order_date: 'desc'
                }
            }),
            prismaClient.order.count({ where })
        ]);

        const mappedOrders = orders.map(order => toOrderResponse(order));

        return {
            page: pageNumber,
            size: size,
            totalOrder: totalCount,
            lastPage: Math.ceil(totalCount / size),
            data: mappedOrders
        };
    }

    static async createV2(user: User, request: CreateOrderRequest): Promise<OrderResponse> {
        const createRequest = orderValidation.CREATE.parse(request);

        // Use a transaction to ensure all operations succeed or none do.
        const order = await prismaClient.$transaction(async (prisma) => {
            let totalPrice = new Decimal(0);
            const orderItemsData = [];
            const productDetails: { id: number; price: Decimal; currentStock: number }[] = [];

            // 1. Fetch all products at once and validate stock levels.
            if (!createRequest.items || createRequest.items.length === 0) {
                throw new HTTPException(400, { message: "Order must contain at least one item." });
            }
            const productIds = createRequest.items.map((item: { product_id: number; quantity: number }) => item.product_id);
            const productsInDb = await prisma.product.findMany({
                where: { id: { in: productIds } }
            });

            // Create a map for easy lookup
            const productMap = new Map(productsInDb.map(p => [p.id, p]));

            for (const item of createRequest.items) {
                const product = productMap.get(item.product_id);

                if (!product) {
                    throw new HTTPException(404, { message: `Product with id ${item.product_id} not found` });
                }

                if (product.quantity < item.quantity) {
                    throw new HTTPException(400, {
                        message: `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
                    });
                }

                // Prepare data for order creation and price calculation
                totalPrice = totalPrice.add(product.price.mul(item.quantity));
                orderItemsData.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_at_order: product.price
                });
                productDetails.push({ id: product.id, price: product.price, currentStock: product.quantity });
            }

            // 2. Create the Order and its OrderItems to get a persistent order ID.
            const newOrder = await prisma.order.create({
                data: {
                    cashier_id: user.id,
                    total_price: totalPrice,
                    status: Orderstatus.on_progress, // Or your desired initial status
                    order_items: {
                        create: orderItemsData
                    }
                }
            });

            // 3. Update product quantities and create stock movement logs for each item.
            const stockOperations = createRequest.items.map(async (item: { product_id: number; quantity: number }) => {
                const product = await prisma.product.findUnique({ where: { id: item.product_id } });
                const newQuantity = (product?.quantity || 0) - item.quantity;

                return prisma.product.update({
                    where: { id: item.product_id },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        },
                        // Create the stock movement log simultaneously
                        stock_movements: {
                            create: {
                                user_id: user.id,
                                order_id: newOrder.id,
                                quantity_changed: -item.quantity, // Negative for a sale
                                new_quantity: newQuantity,
                                type: 'SALE'
                            }
                        }
                    }
                });
            });

            await Promise.all(stockOperations);

            // 4. Return the newly created order ID for refetching outside the transaction
            return newOrder;
        });

        // 5. Fetch the complete order with all relations to return a full response
        const finalOrder = await prismaClient.order.findUnique({
            where: { id: order.id },
            include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!finalOrder) {
            // This should not happen if the transaction was successful
            throw new HTTPException(500, { message: "Failed to retrieve the created order." });
        }

        return toOrderResponse(finalOrder);
    }


    /**
     * Cancels an order, restocks the items, and logs the stock movement.
     * This is wrapped in a transaction to ensure data integrity.
     */
    static async cancelV2(user: User, id: number): Promise<{ id: number, message: string }> {
        const orderId = orderValidation.CANCEL.parse(id);

        await prismaClient.$transaction(async (prisma) => {
            // 1. Find the order and ensure it can be cancelled.
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { order_items: true }
            });

            if (!order) {
                throw new HTTPException(404, { message: "Order not found" });
            }

            const cancellableStatuses = ["on_progress", "pending_payment"]; // Customize as needed
            if (!cancellableStatuses.includes(order.status)) {
                throw new HTTPException(400, {
                    message: `Order cannot be cancelled in its current status: ${order.status}`
                });
            }

            // 2. Restore stock quantities and create stock movement logs for each item.
            const stockRestorationOperations = order.order_items.map(async (item) => {
                const product = await prisma.product.findUnique({ where: { id: item.product_id } });
                const newQuantity = (product?.quantity || 0) + item.quantity;

                return prisma.product.update({
                    where: { id: item.product_id },
                    data: {
                        quantity: {
                            increment: item.quantity
                        },
                        stock_movements: {
                            create: {
                                user_id: user.id,
                                order_id: order.id,
                                quantity_changed: item.quantity, // Positive for restock
                                new_quantity: newQuantity,
                                type: StockMovementType.ADJUSTMENT_INCREASE,
                                notes: `Restock from cancelled Order #${order.id}`
                            }
                        }
                    }
                });
            });

            await Promise.all(stockRestorationOperations);

            // 3. Finally, update the order status.
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "cancelled" } // Use a consistent status name
            });
        });

        return {
            id: orderId,
            message: "Order has been successfully cancelled and items restocked."
        };
    }
}