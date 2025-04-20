import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateCategoryRequest } from "../model/category-model";
import { CategoryService } from "../service/category-service";



export const categoryController = new Hono<{Variables: ApplicationVariables}>

categoryController.post('/categories', authMiddleware, async(c)=> {

    const request = await c.req.json() as CreateCategoryRequest

    const response = await CategoryService.create(request)

    return c.json({
        data: response
    })
})

categoryController.patch('/categories/:id', authMiddleware, async(c)=>{
    const categoryId = c.req.param('id');
    const id = parseInt(categoryId || '');
    const request = await c.req.json() as CreateCategoryRequest

    const response = await CategoryService.update(id, request)

    return c.json({
        data: response
    })

})

categoryController.get('/categories', authMiddleware, async(c)=>{
    
    const response = await CategoryService.get()

    return c.json(response)
})

categoryController.delete('/categories/:id', authMiddleware, async (c)=>{

    const categoryId = Number(c.req.param('id'));
    const response = await CategoryService.delete(categoryId)

    return c.json(response)
})