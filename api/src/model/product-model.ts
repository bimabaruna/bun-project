import type { Product, ProductCategory, Outlet } from "@prisma/client";

export type CreateProductRequest = {
    name: string;
    price: number;
    quantity: number;
    categoryId?: number;
    outletId?: number;
    imageUrl?: string;
}

export type ProductResponse = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    outletId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    imageUrl?: string | null;
    categoryId?: number | null;
    categoryName?: string | null;
    outletName?: string | null;
}

export type UpdateProductRequest = {
    name: string;
    price: number;
    quantity: number;
    categoryId?: number;
    imageUrl?: string;
    outletId?: number;
}

export function toProductResponse(product: Product, category?: ProductCategory | null, outlet?: Outlet | null): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        outletId: product.outlet_id ?? undefined,
        createdAt: product.created_at,
        createdBy: product.created_by,
        updatedAt: product.updated_at ?? null,
        updatedBy: product.updated_by ?? null,
        categoryId: product.category_id ?? null,
        imageUrl: product.image_url ?? null,
        categoryName: category?.category_name ?? null,
        outletName: outlet?.outlet_name ?? null
    }
}

export type ProductListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    data: ProductResponse[],

}