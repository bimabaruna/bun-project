import type { Product, ProductCategory } from "@prisma/client";

export type CreateProductRequest = {
    name: string;
    price: number;
    quantity: number;
    categoryId?: number ;
}

export type ProductResponse = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    categoryId?: number | null;
    categoryName?: string | null;
}

export type UpdateProductRequest = {
    name: string;
    price: number;
    quantity: number;
    categoryId?: number;
}

export function toProductResponse(product: Product, category?: ProductCategory | null): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        createdAt: product.created_at,
        createdBy: product.created_by,
        updatedAt: product.updated_at ?? null,
        updatedBy: product.updated_by ?? null,
        categoryId: product.category_id ?? null,
        categoryName: category?.category_name ?? null
    }
}

export type ProductListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    products: ProductResponse[],
    
}