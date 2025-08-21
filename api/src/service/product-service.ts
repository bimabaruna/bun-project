import { toProductResponse, type CreateProductRequest, type ProductListResponse, type ProductResponse, type UpdateProductRequest } from "../model/product-model";
import type { User } from '@prisma/client';
import { productValidation, type ValidatedProductData } from "../validation/product-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { Readable } from 'stream'
import { File } from 'formdata-node'
import { bucket, bucketName } from '../utils/gcs'
import * as crypto from 'crypto';

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
                category_id: request.categoryId,
                image_url: request.imageUrl,
                outlet_id: request.outletId
            }, include: {
                product_category: true, outlet: true
            }
        })
        return toProductResponse(product, product.product_category)
    }

    static async getList(page: number, size: number, product_name?: string, outlet_id?: number, category_id?: number): Promise<ProductListResponse> {

        const pageNumber = Math.max(1, page)
        const skip = (pageNumber - 1) * size

        const [products, totalCount] = await Promise.all([prismaClient.product.findMany({
            where: {
                is_deleted: false,
                ...(product_name && {
                    name: {
                        contains: product_name,
                        mode: 'insensitive',
                    },
                }),
                ...(outlet_id && {
                    outlet_id: outlet_id,
                }),
                ...(category_id && {
                    category_id: category_id
                })
            },
            include: {
                product_category: true,
                outlet: true
            },
            skip,
            take: size,
            orderBy: [{
                created_at: 'desc',
            },
            {
                name: 'asc'
            }],
        }), prismaClient.product.count({
            where: {
                is_deleted: false,
                ...(product_name && {
                    name: {
                        contains: product_name,
                        mode: 'insensitive',
                    },
                }),
                ...(outlet_id && {
                    outlet_id: outlet_id,
                })
            }
        })
        ]);

        const mapped = products.map((product) =>
            toProductResponse(product, product.product_category, product.outlet)
        );
        return {
            page: page,
            size: size,
            totalCount,
            lastPage: Math.ceil(totalCount / size),
            data: mapped
        }
    }

    static async update(product_id: string, request: UpdateProductRequest, user: User): Promise<ProductResponse> {

        const result = productValidation.UPDATE.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

        const date = new Date().toISOString();

        const getProduct = await prismaClient.product.findFirst({
            where: { id: Number(product_id) }
        })

        if (!getProduct) {
            throw new HTTPException(400, {
                message: "Product Not Found"
            })
        }
        if (getProduct.is_deleted === true) {
            throw new HTTPException(400, {
                message: "Product already deleted"
            })
        }

        const imageUrl = await prismaClient.product.findFirst({
            where: { id: Number(product_id) }
        })

        if (imageUrl?.image_url) {
            const fileName = imageUrl.image_url.split("/").pop();
            const file = bucket.file(`products/${fileName}`);
            await file.exists().then(async (exists) => {
                if (exists[0]) {
                    await file.delete().catch((error) => {
                        console.error("Error deleting file from GCS:", error);
                        throw new HTTPException(500, {
                            message: "Failed to delete image from storage."
                        });
                    });
                }
            }).catch((error) => {
                console.error("Error checking file existence:", error);
                throw new HTTPException(500, {
                    message: "Failed to check image existence in storage."
                });
            })

        }


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
                category_id: request.categoryId,
                image_url: request.imageUrl,
                outlet_id: request.outletId ?? null,
            }, include: {
                product_category: true,
                outlet: true
            }
        })

        return toProductResponse(product, product.product_category, product.outlet)

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

    static async delete(user: User, product_id: number): Promise<{}> {

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
        if (getProduct.is_deleted === true) {
            throw new HTTPException(400, {
                message: "Product already deleted"
            })
        }

        if (getProduct.image_url) {
            const fileName = getProduct.image_url.split("/").pop();
            const file = bucket.file(`products/${fileName}`);
            await file.exists().then(async (exists) => {
                if (exists[0]) {
                    await file.delete().catch((error) => {
                        console.error("Error deleting file from GCS:", error);
                        throw new HTTPException(500, {
                            message: "Failed to delete image from storage."
                        });
                    });
                }
            }).catch((error) => {
                console.error("Error checking file existence:", error);
                throw new HTTPException(500, {
                    message: "Failed to check image existence in storage."
                });
            })

        }
        const date = new Date().toISOString();

        await prismaClient.product.update({
            where: {
                id: product_id
            }, data: {
                image_url: null,
                is_deleted: true,
                deleted_at: date.toString(),
                deleted_by: user.name
            }, include: {
                product_category: true
            }
        })
        return {
            message: 'Successfully deleted the product.'
        }
    }

    private static async calculateFileHash(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const fileStream = Readable.fromWeb(file.stream() as any);

            fileStream.on('error', (err) => {
                console.error('Error reading file stream for hashing:', err);
                reject(new Error(`Failed to read file stream for hashing: ${file.name}`));
            });

            hash.on('error', (err) => {
                console.error('Error during hash calculation:', err);
                reject(new Error(`Failed to calculate hash for file: ${file.name}`));
            });

            hash.on('readable', () => {
                const data = hash.read();
                if (data) {
                    resolve(data.toString('hex'));
                }
            });

            fileStream.pipe(hash);
        });
    }

    private static async _uploadImageToGCS(file: File): Promise<string> {
        let fileHash: string;

        try {
            fileHash = await this.calculateFileHash(file)
        } catch {
            console.error(`Failed to calculate hash for ${file.name}:`);
            throw new Error(`Could not process file ${file.name} for upload.`);
        }
        if (!bucket) {
            console.error("GCS Bucket is not initialized. Cannot upload file.");
            throw new Error("Storage service not available.");
        }

        const ext = file.name.split('.').pop() || 'bin';
        const filename = `products/${fileHash}.${ext}`;
        const gcsFile = bucket.file(filename);

        console.log(`Attempting to upload ${file.name} as ${filename} to bucket ${bucketName}`);

        const stream = gcsFile.createWriteStream({
            metadata: {
                contentType: file.type || 'application/octet-stream',

                metadata: {
                    originalFilename: file.name,
                    contentHash: fileHash
                }
            },
            // public: true,
            resumable: true, // OK for smaller files
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

    static async createV2(user: User, request: CreateProductRequest): Promise<ProductResponse> {
        const createRequest = productValidation.CREATE.parse(request);

        // 1. Create the product and its initial stock movement log.
        // We don't include relations here to avoid the type inference issue.
        const newProduct = await prismaClient.product.create({
            data: {
                name: createRequest.name,
                price: createRequest.price,
                quantity: createRequest.quantity,
                created_by: user.username, // Assumes you want the username string
                category_id: createRequest.categoryId,
                image_url: createRequest.imageUrl,
                outlet_id: createRequest.outletId,
                stock_movements: {
                    create: {
                        user_id: user.id,
                        quantity_changed: createRequest.quantity, // The initial amount
                        new_quantity: createRequest.quantity,     // The new total is the initial amount
                        type: 'INITIAL_STOCK',
                        notes: 'Product created in system.'
                    }
                }
            }
        });

        // 2. Fetch the complete product record with relations.
        // This ensures TypeScript correctly infers the types of `product_category` and `outlet`.
        const finalProduct = await prismaClient.product.findUniqueOrThrow({
            where: { id: newProduct.id },
            include: {
                product_category: true,
                outlet: true
            }
        });

        return toProductResponse(finalProduct, finalProduct.product_category, finalProduct.outlet);
    }

    /**
     * Updates a product's details. If the quantity is changed, it logs a stock adjustment.
     * This is wrapped in a transaction to ensure data integrity.
     */
    static async updateV2(product_id: string, request: UpdateProductRequest, user: User): Promise<ProductResponse> {
        const updateRequest = productValidation.UPDATE.parse(request);
        const productIdNumber = Number(product_id);

        // The transaction will handle the update and return the ID of the updated product.
        const updatedProductId = await prismaClient.$transaction(async (prisma) => {
            // 1. Fetch the current state of the product
            const currentProduct = await prisma.product.findUnique({
                where: { id: productIdNumber }
            });

            if (!currentProduct) {
                throw new HTTPException(404, { message: "Product Not Found" });
            }
            if (currentProduct.is_deleted) {
                throw new HTTPException(400, { message: "Cannot update a deleted product" });
            }

            // 2. Handle image deletion if a new image is provided or if it's explicitly removed
            if (currentProduct.image_url && (updateRequest.imageUrl || updateRequest.imageUrl === null)) {
                const fileName = currentProduct.image_url.split("/").pop();
                if (fileName) {
                    const file = bucket.file(`products/${fileName}`);
                    const [exists] = await file.exists();
                    if (exists) {
                        await file.delete().catch(error => {
                            console.error("Error deleting old file from GCS:", error);
                        });
                    }
                }
            }

            // 3. Determine if stock quantity has changed and prepare stock movement data
            let stockMovementData: any = undefined;
            if (updateRequest.quantity !== undefined && updateRequest.quantity !== currentProduct.quantity) {
                const quantityChange = updateRequest.quantity - currentProduct.quantity;
                stockMovementData = {
                    user_id: user.id,
                    quantity_changed: quantityChange,
                    new_quantity: updateRequest.quantity,
                    type: quantityChange > 0 ? 'ADJUSTMENT_INCREASE' : 'ADJUSTMENT_DECREASE',
                    notes: 'Manual stock update by admin.'
                };
            }

            // 4. Update the product and create stock movement log if necessary
            const updatedProduct = await prisma.product.update({
                where: { id: productIdNumber },
                data: {
                    name: updateRequest.name,
                    price: updateRequest.price,
                    quantity: updateRequest.quantity,
                    updated_by: user.username,
                    category_id: updateRequest.categoryId,
                    image_url: updateRequest.imageUrl,
                    outlet_id: updateRequest.outletId,
                    stock_movements: stockMovementData ? { create: stockMovementData } : undefined
                }
            });

            return updatedProduct.id;
        });

        // 5. After the transaction is successful, fetch the final product with all relations.
        // This ensures TypeScript has the correct type information.
        const finalProduct = await prismaClient.product.findUniqueOrThrow({
            where: { id: updatedProductId },
            include: {
                product_category: true,
                outlet: true
            }
        });

        return toProductResponse(finalProduct, finalProduct.product_category, finalProduct.outlet);
    }

    /**
     * Soft-deletes a product. This action does not create a stock movement.
     * The stock quantity remains for historical reporting purposes.
     */
    static async deleteV2(user: User, product_id: number): Promise<{ message: string }> {
        const productIdNumber = productValidation.DELETE.parse(product_id);

        const product = await prismaClient.product.findUnique({
            where: { id: productIdNumber }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product Not Found" });
        }
        if (product.is_deleted) {
            throw new HTTPException(400, { message: "Product already deleted" });
        }

        // Handle GCS image deletion
        if (product.image_url) {
            const fileName = product.image_url.split("/").pop();
            if (fileName) {
                const file = bucket.file(`products/${fileName}`);
                const [exists] = await file.exists();
                if (exists) {
                    await file.delete().catch(error => console.error("Error deleting file from GCS on soft delete:", error));
                }
            }
        }

        await prismaClient.product.update({
            where: { id: productIdNumber },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
                deleted_by: user.username,
                image_url: null // Clear the image URL on delete
            }
        });

        return {
            message: 'Successfully deleted the product.'
        };
    }

    // this function is not used in the current code, but it can be used to create a product with an image
    // static async createV2(
    //     user: User,
    //     data: ValidatedProductData, // zod
    //     imageFile: File | null
    // ): Promise<ProductResponse> {

    //     let imageUrl: string | null = null;
    //     if (imageFile) {
    //         try {
    //             imageUrl = await ProductService._uploadImageToGCS(imageFile);
    //         } catch (uploadError) {
    //             console.error("Product creation failed due to image upload error:", uploadError);
    //             throw new Error("Image upload failed, product not created.");
    //         }
    //     }
    //     try {
    //         const product = await prismaClient.product.create({
    //             data: {
    //                 name: data.name,
    //                 price: data.price,
    //                 quantity: data.quantity,
    //                 created_by: user.username,
    //                 category_id: data.categoryId,
    //                 image_url: imageUrl
    //             },
    //             include: {
    //                 product_category: true
    //             }
    //         });

    //         return toProductResponse(product, product.product_category);

    //     } catch (dbError) {
    //         console.error("Database error during product creation:", dbError);
    //         throw new Error("Failed to save product to database.");
    //     }
    // }


}