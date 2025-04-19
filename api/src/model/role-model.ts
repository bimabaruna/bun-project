

export type CreateRoleRequest = {
    roleName: string;
}

export type RoleResponse = {
    id: number;
    roleName: string
}

export type RoleListReponse = {
    data: RoleResponse[]
}