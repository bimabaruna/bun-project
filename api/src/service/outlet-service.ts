import type { CreateRequestOutlet, OutletListResponse, OutletResponse, updateRequestOutlet } from "../model/outlet-model"
import { prismaClient } from "../application/database"
import { HTTPException } from "hono/http-exception"
import { toOutletResponse } from "../model/outlet-model"
import { outletValidation } from "../validation/outlet-validation"
import type { User } from "@prisma/client"
import { toProductResponse } from "../model/product-model"


export class OutletService {


    static async create(request: CreateRequestOutlet): Promise<OutletResponse> {

        const req = outletValidation.CREATE.safeParse(request)

        const outlet = await prismaClient.outlet.create({
            data: {
                outlet_name: request.outletName,
                address: request.outletAddress,
                phone: request.phone
            }
        })

        return toOutletResponse(outlet)
    }

    static async update(outletId: number, request: updateRequestOutlet): Promise<OutletResponse> {

        const req = outletValidation.UPDATE.safeParse(request)

        const isExist = await prismaClient.outlet.count({
            where: {
                id: outletId
            }
        })

        if (!isExist) {
            throw new HTTPException(400, {
                message: 'Outlet Not Found'
            })
        }

        const outlet = await prismaClient.outlet.update({
            where: {
                id: outletId
            }, data: {
                outlet_name: request.outletName,
                address: request.outletAddress,
                phone: request.phone
            }
        })

        return toOutletResponse(outlet)
    }

    static async delete(outletId: number): Promise<OutletResponse> {

        const isExist = await prismaClient.outlet.count({
            where: {
                id: outletId
            }
        })

        if (!isExist) {
            throw new HTTPException(400, {
                message: 'Outlet Not Found'
            })
        }

        const outlet = await prismaClient.outlet.delete({
            where: {
                id: outletId
            }
        })

        return toOutletResponse(outlet)
    }

    static async get(): Promise<OutletListResponse> {

        const outlets = await prismaClient.outlet.findMany({})

        const outletsmap = outlets.map(toOutletResponse)

        return {data: outletsmap}
    }
}