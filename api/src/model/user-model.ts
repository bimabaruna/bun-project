import type { EmployeeDetails, Outlet, Role, User } from "@prisma/client";
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
    userDetails?: userDetailsResponse | null;
}

export type UpdateUserRequest = {
    password?: string;
    name?: string;
    roleId?: number;
}

export function toUserResponse(
    user: User & {
        user_details?: EmployeeDetails & {
            outlet?: Outlet | null;
        } | null;
    },
    role?: Role | null
): UserResponse {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        roleId: user.role_id ?? null,
        roleName: role?.role_name ?? null,
        userDetails: user.user_details
            ? {
                userId: user.user_details.id,
                outletId: user.user_details.outlet_id,
                lastName: user.user_details.last_name ?? null,
                firstName: user.user_details.first_name,
                email: user.user_details.email,
                position: user.user_details.position,
                phone: user.user_details.phone,
                salary: Number(user.user_details.salary) ?? null
            }
            : null
    };
}

export type UserListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    data: UserResponse[]
}

export type userDetailsResponse = {
    userId: number,
    firstName: string,
    lastName: string | null,
    email: string,
    phone: string,
    position: string,
    salary: number,
    outletId?: number | null,
}