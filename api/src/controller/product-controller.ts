import { Hono } from "hono"
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import type { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";
import { date, number } from "zod";
import { productValidation } from "../validation/product-validation";



export const productController = new Hono<{ Variables: ApplicationVariables }>()


productController.post('/products', authMiddleware, async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as CreateProductRequest

    const response = await ProductService.create(user, request)

    return c.json({
        data: response
    })
})

productController.get('/products', authMiddleware, async (c) => {

    const size = Number(c.req.query('size'))
    const page = Number(c.req.query('page'))
    const product_name = c.req.query('productName')

    const response = await ProductService.getList(page, size, product_name)
    console.log(response);
    return c.json(response)
})

productController.patch('/products/:id', authMiddleware, async (c) => {

    const user = c.get('user') as User
    const product_id = c.req.param('id')
    const request = await c.req.json() as UpdateProductRequest
    const response = await ProductService.update(product_id, request, user)

    return c.json({
        data: response
    })
})

productController.get('/products/:id', authMiddleware, async (c) => {
    const product_id = Number(c.req.param('id'))
    const response = await ProductService.get(product_id)

    return c.json({
        data: response
    })
})

productController.delete('/products/:id', authMiddleware, async (c) => {
    const product_id = Number(c.req.param('id'))
    const response = await ProductService.delete(product_id)

    return c.json(
        response
    )
})

productController.post('/v2/products', authMiddleware, async (c)=>{
    const user = c.get('user') as User;
    
    try {
       
        const formData = await c.req.formData();

        const image = formData.get('image');
        let imageFile: File | null = null;
        if (image instanceof File) {
            imageFile = image as unknown as File;
            console.log(`Received image file: ${image.name}, type: ${image.type}, size: ${image.size}`);
        } else if (image) {
            console.warn("Received 'image' field, but it was not a standard File object.");
        }

        const dataString = formData.get('data'); 
        if (!dataString || typeof dataString !== 'string') {
            c.status(400);
            return c.json({ error: "Missing or invalid 'data' field. Expected a JSON string." });
        }

        let productDataJson: any;
        try {
            productDataJson = JSON.parse(dataString);
        } catch (error) {
            c.status(400);
            return c.json({ error: "Invalid JSON format in 'data' field." });
        }

        const validationResult = productValidation.CREATE.safeParse(productDataJson);
        if (!validationResult.success) {
            const messages = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            c.status(400);
            return c.json({ error: "Validation failed for data field", details: messages });
        }
        const validatedData = validationResult.data; 
        const { File: FormDataNodeFile } = await import('formdata-node');
        const convertedImageFile = imageFile ? new FormDataNodeFile([imageFile], imageFile.name, { type: imageFile.type }) : null;
        const response = await ProductService.createV2(user, validatedData, convertedImageFile);

        return c.json({
            data: response
        });

    } catch (error: any) {
        console.error("Error in POST /products:", error);
        
        if (error.message?.includes("Upload failed") || error.message?.includes("Storage service not available")) {
             c.status(500); // Or 400 Bad Request if file format was wrong?
             return c.json({ error: "Image processing failed.", detail: error.message });
        }
        if (error.message?.includes("Failed to save product")) {
             c.status(500);
             return c.json({ error: "Database operation failed.", detail: error.message });
        }

        // Generic fallback error
        c.status(500);
        return c.json({
            error: "An unexpected error occurred while creating the product.",
        });
    }
})