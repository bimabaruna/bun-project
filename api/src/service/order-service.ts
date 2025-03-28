import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse, type UpdateProductRequest } from "../model/product-model";
import type { User } from '@prisma/client';
import { productValidation } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { use } from "react";
import { date, number } from "zod";
import { HTTPException } from "hono/http-exception";
import { toOrderResponse, type CreateOrderRequest, type OrderResponse } from "../model/order-model";
import type { Decimal } from "@prisma/client/runtime/library";
import { orderValidation } from "../validation/order-validation";
import { userController } from "../controller/user-conroller";

export class OrderService {

    static async create(user: User, request: CreateOrderRequest): Promise<OrderResponse> {

        request = orderValidation.CREATE.parse(request);
        

        let totalPrice = 0;
        const orderItems: { 
            product: { 
                connect: { id: number } 
            }; quantity: number; price_at_order: Decimal }[] = [];

        const orders = await prismaClient.$transaction(async (prisma) => {
            for (const { product_id, quantity } of request.items) {
                const product = await prisma.product.findUnique({
                    where: { id: product_id }
                });

                if (!product) {
                    throw new HTTPException(400, { message: 'id not found' });
                }

                if (product.quantity < quantity) {
                    throw new HTTPException(400, { message: 'Insufficient stock' });
                }

                totalPrice += Number(product.price) * quantity;
                orderItems.push({ 
                    product: { 
                        connect: { 
                            id: product_id 
                        } 
                    }, quantity, price_at_order: product.price });


                await prisma.product.update({
                    where: { id: product_id },
                    data: { quantity: product.quantity - quantity }
                });
                
            }

            const order = await prisma.order.create({
                data: {
                    customer_id: user.id,
                    total_price: totalPrice,
                    status: "on_progress",
                    order_items: {
                        create: orderItems
                    }
                }, include: {
                    order_items: true
                }
            });         
            return order
        });


        return toOrderResponse(orders);
    }

    static async getById(user: User, id: string): Promise<OrderResponse>{

        const order = await prismaClient.order.findFirst({
            where:{
                id: Number(id)
            }
        })

        if(!order){
            throw new HTTPException(400,{
                message: "product not exist"
            })
        }

        return {
            id: Number(order.id),
            customer_id: user.id,
            total_price: order.total_price,
            items: await prismaClient.orderItem.findMany({
                where: {
                    order_id: order.id
                }
            })
            
        }
    }
}