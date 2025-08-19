import type { User } from '@prisma/client';
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { toOrderResponse, type CreateOrderRequest, type OrderListResponse, type OrderResponse } from "../model/order-model";
import type { Decimal } from "@prisma/client/runtime/library";
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
                status: "canceled"
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
}