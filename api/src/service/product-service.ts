import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse, type UpdateProductRequest } from "../model/product-model";
import type { User } from '@prisma/client';
import { productValidation } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { use } from "react";
import { date } from "zod";
import { HTTPException } from "hono/http-exception";

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

    static async getList(page: number, size: number, product_name?: string): Promise<ProductListResponse> {

        const pageNumber = Math.max(1, page)
        const skip = (pageNumber - 1) * size

        const [products, totalCount] = await Promise.all([prismaClient.product.findMany({
            where: product_name ? {
                name: {
                    contains: product_name,
                    mode: 'insensitive',
                },
            } : undefined,
            skip: skip,
            take: size,
        }), prismaClient.product.count({
            where: product_name ? {
                name: {
                    contains: product_name,
                    mode: 'insensitive'
                },
            } : undefined
        })
        ])

        const mapped = products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: Number(product.price)
        }))
        return {
            page: page,
            size: size,
            totalCount,
            lastPage: Math.ceil(totalCount / size),
            products: mapped

        }
    }

    static async update(product_id: string, request: UpdateProductRequest, user: User): Promise<ProductResponse> {

        request = productValidation.UPDATE.parse(request)

        const date = new Date().toISOString();

        const product = await prismaClient.product.update({
            where: {
                id: Number(product_id)
            },
            data: {
                name: request.name,
                price: request.price,
                quantity: request.quantity,
                updated_at: date.toString(),
                updated_by: user.username
            }
        })

        return toProductResponse(product)

    }

    static async get(product_id: number): Promise<ProductResponse> {
        product_id = productValidation.GET.parse(product_id)

        const product = await prismaClient.product.findFirst({
            where: {
                id: product_id
            }
        })

        if (!product) {
            throw new Error('Product not found')
        }

        return toProductResponse(product)
    }

    static async delete(product_id: number): Promise<ProductResponse> {

        product_id = productValidation.DELETE.parse(product_id)

        const getProduct = await prismaClient.product.findFirst({
            where: {
                id: product_id
            }
        })

        if (!getProduct) {
            throw new HTTPException(400, {
                message: "Product Not Found"
            })
        }

        const product = await prismaClient.product.delete({
            where: {
                id: product_id
            }
        })

        return toProductResponse(product)
    }
}