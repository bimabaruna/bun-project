import type { ProductCategory } from "@prisma/client";
import type { CategoryService } from "../service/category-service";

export interface CreateCategoryRequest {
    categoryName: string;
}

export interface UpdateCategoryRequest {
    categoryName: string;
}

export interface CategoryResponse {
    id: number;
    categoryName: string;
    categoryService?: CategoryService;
}

export interface CategoryListResponse {
    data: CategoryResponse[]
}

export function toCategoryResponse(category: ProductCategory) {
    return {
        id: category.id,
        categoryName: category.category_name
    }
}