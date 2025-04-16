import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UpdateUserRequest, type UserListResponse, type UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { sign, verify } from "hono/jwt";
import type { User } from "@prisma/client";
import { tokenToString } from "typescript";
import { use } from "react";
import { nan } from "zod";
import { skip } from "@prisma/client/runtime/library";

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
const JWT_EXPIRES_IN = '1h';

export class UserService {

    static async register(request: RegisterUserRequest): Promise<UserResponse> {

        request = UserValidation.REGISTER.parse(request)

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
        })

        if (totalUserWithSameUsername != 0) {
            throw new HTTPException(400, {
                message: "Username Already Exist!"
            })
        }

        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        const user = await prismaClient.user.create({
            data: request
        })

        return toUserResponse(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {


        const result = UserValidation.LOGIN.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

        let user = await prismaClient.user.findUnique({
            where: {
                username: request.username
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Username or Password is wrong!"
            })
        }

        const isPasswordValid = await Bun.password.verify(request.password, user.password, "bcrypt")

        if (!isPasswordValid) {
            throw new HTTPException(401, {
                message: "Username or password is wrong!"
            })
        }

        const token = await sign(
            { id: user.id, username: user.username },
            JWT_SECRET
        )

        user = await prismaClient.user.update({
            where: {
                username: request.username
            },
            data: {
                token: token
            }
        })

        const response = toUserResponse(user)

        response.token = user.token!;
        return response
    }

    static async get(token: string | undefined | null): Promise<User> {

        token = UserValidation.TOKEN.parse(token)

        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: 'Unathorized'
            })
        }

        return user
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        request = UserValidation.UPDATE.parse(request)

        if (request.name) {
            user.name = request.name
        }

        if (request.password) {
            user.password = await Bun.password.hash(request.password, {
                algorithm: 'bcrypt',
                cost: 10
            })
        }

        user = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        return toUserResponse(user)
    }

    static async logout(user: User): Promise<boolean> {

        await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return true

    }

    static async getList(page: number, size: number, username?: string): Promise<UserListResponse> {

        const pageNumber = Math.max(1, page)
        const skip = (pageNumber - 1) * size
        const [userList, totalCount] = await Promise.all([prismaClient.user.findMany({
            where: username ? {
                username: {
                    contains: username,
                    mode: 'insensitive',
                },
            } : undefined,
            skip: skip,
            take: size
        }), prismaClient.user.count({
            where: username ? {
                username: {
                    contains: username,
                    mode: 'insensitive',
                },
            } : undefined
        })
        ])

        const transformedUsers = userList.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name
        }))


        return {
            page: page,
            size: size,
            totalCount: totalCount,
            data: transformedUsers
        }
    }

    static async deleteUser(id: number): Promise<boolean> {

        const userExist = await prismaClient.user.count({
            where: {
                id: id
            }
        })
        if (!userExist) {
            return false
        }
        await prismaClient.user.delete({
            where: {
                id: id
            }
        })

        return true
    }
}