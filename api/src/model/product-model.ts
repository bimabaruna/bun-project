import type { Product } from "@prisma/client";

export type CreateProductRequest = {
    name: string;
    price: number;
    quantity: number;
}

export type ProductResponse = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    created_at?: Date;
    created_by?: string;
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        created_at: product.created_at,
        created_by: product.created_by
    }
}

export type ProductListResponse = {
    page: number,
    size: number,
    products: ProductResponse[],
    
}