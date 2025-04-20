import type { ProductCategory } from "@prisma/client";
import type { CategoryService } from "../service/category-service";

export type CreateCategoryRequest = {
    categoryName : string;
}

export type UpdateCategoryRequest = {
    categoryName : string;
}

export type CategoryResponse = {
    id: number;
    categoryName: string;
}

export type CategoryListResponse = {
    data: CategoryResponse[]
}

export function toCategoryResponse(category: ProductCategory){
    return {
        id: category.id,
        categoryName: category.category_name
    }
}