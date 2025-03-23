import type { User } from "@prisma/client";
import type { NameArgs } from "@prisma/client/runtime/library";

export type RegisterUserRequest = {
    username: string;
    password: string;
    name: string;
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
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        username: user.username
    }
}

export type UserListResponse = {
    data: UserResponse[]
  }