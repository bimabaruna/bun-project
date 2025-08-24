import { prismaClient } from "../application/database";
import type { StockMovementResponse, stockMovementListResponse } from "../model/stock-movements-model";

export class StockMovementsService {

    static async getList(page: number, size: number, order_id?: number, product_name?: string): Promise<stockMovementListResponse> {
        const pageNumber = Math.max(1, page)
        const skip = (pageNumber - 1) * size

        const [stockMovements, totalCount] = await Promise.all([prismaClient.stockMovement.findMany({
            where: {
                ...(product_name && {
                    product: {
                        name: {
                            contains: product_name,
                            mode: 'insensitive'
                        }
                    },
                }),
                ...(order_id && {
                    order_id: order_id
                })
            }, orderBy: {
                created_at: 'desc'
            },
            include: {
                product: true,
                user: true,
                order: true
            },
            skip,
            take: size
        }), prismaClient.stockMovement.count({
            where: {
                ...(product_name && {
                    product: {
                        name: {
                            contains: product_name,
                            mode: 'insensitive'
                        }
                    },
                }),
                ...(order_id && {
                    order_id: order_id
                })
            }
        })
        ]);
        const mapped = stockMovements.map((movement) => {
            return {
                id: movement.id,
                productId: movement.product_id,
                productName: movement.product?.name ?? null,
                userId: movement.user_id,
                username: movement.user?.username ?? null,
                quantity: movement.product.quantity,
                movementType: movement.type,
                orderId: movement.order_id ?? null,
                quantityChange: movement.quantity_changed ?? 0,
                quanityAfter: movement.new_quantity ?? 0,
                createdAt: movement.created_at,
            }
        })
        return {
            page: pageNumber,
            size,
            totalCount,
            lastPage: Math.ceil(totalCount / size),
            data: mapped
        }
    }

}