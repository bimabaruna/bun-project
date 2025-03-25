import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse } from "../model/product-model";
import type { User } from '@prisma/client';
import { productValidation } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { use } from "react";

export class ProductService {

    static async create(user: User, request: CreateProductRequest): Promise<ProductResponse> {

        request = productValidation.CREATE.parse(request)

        const product = await prismaClient.product.create({
            data: {
                name: request.name,
                price: request.price,
                quantity: request.quantity,
                created_by: user.username
            }
        })
        return toProductResponse(product)
    }

    static async getList(page: number, size: number): Promise<ProductListResponse> {

        const products = await prismaClient.product.findMany({
            skip: page,
            take: size,
        })

        const mapped = products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: Number(product.price)
        }))
        return {
            page: page,
            size: size,
            products: mapped
            
        }
    }
}