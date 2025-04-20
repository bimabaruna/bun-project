import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { toCategoryResponse, type CategoryListResponse, type CategoryResponse, type CreateCategoryRequest, type UpdateCategoryRequest } from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";


export class CategoryService {

    static async create(request: CreateCategoryRequest): Promise<CategoryResponse>{

        const req = CategoryValidation.CREATE.safeParse(request)

        if(!req.success){
            throw new Error(req.error.message)
        }

        let category = await prismaClient.productCategory.create({
            data:{
                category_name: request.categoryName
            }
        })

        return toCategoryResponse(category)
    }

    static async update(categoryId: number, request: UpdateCategoryRequest): Promise<CategoryResponse>{

        const req = CategoryValidation.UPDATE.safeParse(request)

        if(!req.success){
            throw new Error(req.error.message)
        }

        const isExist = await prismaClient.productCategory.count({
            where: {
                id: categoryId
            }
        })

        if(!isExist){
            throw new HTTPException(400,{
                message: 'Category Not Found'
            })
        }

        const category = await prismaClient.productCategory.update({
            where: {
                id: categoryId
            }, data:{
                category_name: request.categoryName
            }
        })

        return toCategoryResponse(category)

    }

    static async get():Promise<CategoryListResponse>{
        const categories = await prismaClient.productCategory.findMany({

        })

        const categoriesMap = categories.map(toCategoryResponse)

        return {data: categoriesMap}
    }

    static async delete(categoryId: number):Promise<boolean>{
        const req  = CategoryValidation.DELETE.safeParse(categoryId)

        if(!req.success){
            throw new Error(req.error.message)
        }

        const isExist = await prismaClient.productCategory.count({
            where:{
                id: categoryId
            }
        })
        
        if(!isExist){
            throw new HTTPException(400, {message: 'Category not found'})
        }

        await prismaClient.productCategory.delete({
            where: {
                id: categoryId
            }
        })

        return true

    }


}