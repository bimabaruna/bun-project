import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse, type UpdateProductRequest } from "../model/product-model";
import type { User, ProductCategory } from '@prisma/client';
import { productValidation, type ValidatedProductData } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { Storage } from '@google-cloud/storage'
import { Readable } from 'stream'
import { File } from 'formdata-node'
import { bucket, bucketName } from '../utils/gcs'
import path from 'path'


// const keyPath = path.resolve(import.meta.dir, '../gcs-service-account.json')
// console.log('Resolved Key Path:', keyPath)
// const storage = new Storage({
//   keyFilename: keyPath,
// })
// const bucket = storage.bucket(bucketName)

export class ProductService {

    static async create(user: User, request: CreateProductRequest): Promise<ProductResponse> {

        const result = productValidation.CREATE.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }


        const product = await prismaClient.product.create({
            data: {
                name: request.name,
                price: request.price,
                quantity: request.quantity,
                created_by: user.username,
                category_id: request.categoryId
            }, include: {
                product_category: true
            }
        })
        return toProductResponse(product, product.product_category)
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
            include: {
                product_category: true
            },
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

        const mapped = products.map((product) =>
            toProductResponse(product, product.product_category)
        );
        return {
            page: page,
            size: size,
            totalCount,
            lastPage: Math.ceil(totalCount / size),
            products: mapped
        }
    }

    static async update(product_id: string, request: UpdateProductRequest, user: User): Promise<ProductResponse> {

        const result = productValidation.UPDATE.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

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
                updated_by: user.username,
                category_id: request.categoryId
            }, include: {
                product_category: true
            }
        })

        return toProductResponse(product, product.product_category)

    }

    static async get(product_id: number): Promise<ProductResponse> {
        product_id = productValidation.GET.parse(product_id)

        const product = await prismaClient.product.findFirst({
            where: {
                id: product_id
            }, include: {
                product_category: true
            }
        })

        if (!product) {
            throw new Error('Product not found')
        }

        return toProductResponse(product, product.product_category)
    }

    static async delete(product_id: number): Promise<{}> {

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
            }, include: {
                product_category: true
            }
        })

        return {
            message: 'Successfully deleted the product.'
        }
    }

    private static async _uploadImageToGCS(file: File): Promise<string> {
        if (!bucket) {
             console.error("GCS Bucket is not initialized. Cannot upload file.");
             throw new Error("Storage service not available.");
        }

        const ext = file.name.split('.').pop() || 'bin'; 
        const filename = `products/${Date.now()}.${ext}`;
        const gcsFile = bucket.file(filename);

        console.log(`Attempting to upload ${file.name} as ${filename} to bucket ${bucketName}`);

        const stream = gcsFile.createWriteStream({
            metadata: {
                contentType: file.type || 'application/octet-stream', 
            },
            // public: true,
            resumable: false, // Consider false for smaller files if needed
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (err) => {
                console.error(`GCS Upload Stream Error for ${filename}:`, err);
                reject(new Error(`Upload failed for file ${file.name}`));
            });

            stream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
                console.log(`GCS Upload Finished for ${filename}. Public URL: ${publicUrl}`);
                resolve(publicUrl);
            });

    
            try {
                const readable = Readable.fromWeb(file.stream() as any); 
                readable.pipe(stream);
            } catch (pipeError) {
                console.error(`Error piping file stream for ${filename}:`, pipeError);
                reject(new Error(`Failed to read file stream for ${file.name}`));
            }
        });
    }

    static async createV2(
        user: User,
        data: ValidatedProductData, // Use validated data type from Zod
        imageFile: File | null
    ): Promise<ProductResponse> {

        let imageUrl: string | null = null;
        if (imageFile) {
            try {
                imageUrl = await ProductService._uploadImageToGCS(imageFile);
            } catch (uploadError) {
                console.error("Product creation failed due to image upload error:", uploadError);
                throw new Error("Image upload failed, product not created.");
            }
        }
        try {
            const product = await prismaClient.product.create({
                data: {
                    name: data.name,
                    price: data.price,       
                    quantity: data.quantity,
                    created_by: user.username,
                    category_id: data.categoryId,
                    image_url: imageUrl 
                },
                include: {
                    product_category: true 
                }
            });

            return toProductResponse(product, product.product_category);

        } catch(dbError) {
             console.error("Database error during product creation:", dbError);
             throw new Error("Failed to save product to database.");
        }
    }
}