import type { Role, User } from "@prisma/client";
import type { NameArgs } from "@prisma/client/runtime/library";
import { number } from "zod";

export type RegisterUserRequest = {
    username: string;
    password: string;
    name: string;
    roleId?: number;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UserResponse = {
    id: number;
    username: string;
    name: string;
    token?: string;
    roleId?: number | null;
    roleName?: string | null;
}

export type UpdateUserRequest = {
    password?: string;
    name?: string;
    roleId?: number;
}

export function toUserResponse(user: User, role?: Role | null): UserResponse {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        roleId: user.role_id ?? null,
        roleName: role?.role_name ?? null
    }
}

export type UserListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    data: UserResponse[]
}