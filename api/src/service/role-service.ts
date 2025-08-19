import { PrismaClient } from "@prisma/client/extension";
import { prismaClient } from "../application/database";
import { toRoleResponse, type CreateRoleRequest, type RoleListReponse, type RoleResponse } from "../model/role-model";
import { RoleValidation } from "../validation/role-validation";
import { HTTPException } from "hono/http-exception";


export class RoleService {

    static async create(request: CreateRoleRequest): Promise<RoleResponse> {

        const req = RoleValidation.CREATE.safeParse(request)

        if (!req.success) {
            throw new Error(req.error.message);
        }

        let role = await prismaClient.role.create({
            data: {
                role_name: request.roleName
            }
        })

        return {
            id: role.id,
            roleName: role.role_name
        }
    }
    static async get(): Promise<RoleListReponse> {


        const role = await prismaClient.role.findMany({

        })

        const roleMapped = role.map(role => ({
            id: role.id,
            roleName: role.role_name
        }))

        return { data: roleMapped }
    }
    static async delete(roleId: number): Promise<RoleResponse> {
        const isExist = await prismaClient.role.count({
            where: {
                id: roleId
            }
        })

        if (!isExist) {
            throw new HTTPException(400, {
                message: 'Role Not Found'
            })
        }

        const role = await prismaClient.role.delete({
            where: {
                id: roleId
            }
        })
        return toRoleResponse(role)
    }
}
