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
                image_url: request.imageUrl
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
            where: {
                is_deleted: false,
                ...(product_name && {
                    name: {
                        contains: product_name,
                        mode: 'insensitive',
                    },
                }),
            },
            include: {
                product_category: true,
            },
            skip,
            take: size,
        }), prismaClient.product.count({
            where: {
                is_deleted: false,
                ...(product_name && {
                    name: {
                        contains: product_name,
                        mode: 'insensitive',
                    },
                }),
            }
        })
        ]);

        const mapped = products.map((product) =>
            toProductResponse(product, product.product_category)
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
                image_url: request.imageUrl
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

    static async createV2(
        user: User,
        data: ValidatedProductData, // zod
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

        } catch (dbError) {
            console.error("Database error during product creation:", dbError);
            throw new Error("Failed to save product to database.");
        }
    }
}