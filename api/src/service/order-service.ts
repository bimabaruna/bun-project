import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse, type UpdateProductRequest } from "../model/product-model";
import type { User } from '@prisma/client';
import { productValidation } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { use } from "react";
import { date, number, promise } from "zod";
import { HTTPException } from "hono/http-exception";
import { toOrderResponse, type CreateOrderRequest, type OrderResponse } from "../model/order-model";
import type { Decimal } from "@prisma/client/runtime/library";
import { orderValidation } from "../validation/order-validation";
import { userController } from "../controller/user-conroller";

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
                    customer_id: user.id,
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
            customer_id: user.id,
            total_price: order.total_price,
            items: order.order_items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                product_name: item.product.name,
                order_items_id: item.id,
                price_at_order: item.price_at_order
            }))

        }
    }
    static async cancel(user: User, id: number): Promise<{}>{
        id = orderValidation.CANCEL.parse(id)

        const order = await prismaClient.order.findFirst({
            where:{
                id: id
            }, include:{
                order_items:{
                    include:{
                        product: true
                    }
                }
            }
            
        })

        if (!order){
            throw new HTTPException(400,{
                message: "Order not found"
            })
        }

        const cancellableStatuses = ["on_progress", "pending_payment", "paid"];

        if (!cancellableStatuses.includes(order.status)){
            throw new HTTPException(400,{
                message: `Order cannot be cancelled in its current status: ${order.status}`
            })
        }

        await Promise.all(order.order_items.map(item =>
            prismaClient.product.update({
                where:{
                    id: item.product.id
                }, data:{
                    quantity: {increment: item.quantity}
                }
            })
        ))

        await prismaClient.order.update({
            where:{
                id: order.id
            },
            data:{
                status: "canceled"
            }, include:{
                order_items:{
                    include:{
                        product:true
                    }
                }
            }
        })

        return {
                id: order.id,
                message: "Order are Canceled"
        }
    }
}