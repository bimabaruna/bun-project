import { PrismaClient } from "@prisma/client/extension";
import { prismaClient } from "../application/database";
import type { CreateRoleRequest, RoleListReponse, RoleResponse } from "../model/role-model";
import { RoleValidation } from "../validation/role-validation";
import { resolve } from "path";


export class RoleService {

    static async create(request: CreateRoleRequest): Promise<RoleResponse>{

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
    static async get(): Promise<RoleListReponse>{
        
       
        const role = await prismaClient.role.findMany({

        })
        
        const roleMapped = role.map(role=>({
            id: role.id,
            roleName: role.role_name
        }))

        return {data: roleMapped}
    }
}
