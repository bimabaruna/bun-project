
import type { Role } from "@prisma/client"

export type CreateRoleRequest = {
    roleName: string;
}

export type RoleResponse = {
    id: number;
    roleName: string
}

export function toRoleResponse(role: Role): RoleResponse {
    return {
        id: role.id,
        roleName: role.role_name
    }
}

export type RoleListReponse = {
    data: RoleResponse[]
}