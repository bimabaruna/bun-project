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
    updated_at?: Date | null;
    updated_by?: string | null;
}

export type UpdateProductRequest = {
    name: string;
    price: number;
    quantity: number;
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        created_at: product.created_at,
        created_by: product.created_by,
        updated_at: product.updated_at ?? null,
        updated_by: product.updated_by ?? null
    }
}

export type ProductListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    products: ProductResponse[],
    
}