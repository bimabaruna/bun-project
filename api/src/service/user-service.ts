import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UpdateUserRequest, type UserListResponse, type UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { sign } from "hono/jwt";
import type { Role, User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
const JWT_EXPIRES_IN = '1h';

export class UserService {

    static async register(request: RegisterUserRequest): Promise<UserResponse> {

        const result = UserValidation.REGISTER.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

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
            data: {
                username: request.username,
                name: request.name,
                password: request.password,
                role_id: request.roleId
            }, include: {
                role: true
            }
        })

        return toUserResponse(user, user.role)
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

        const userLogin = await prismaClient.user.update({
            where: {
                username: request.username
            },
            data: {
                token: token
            }, include: {
                role: true
            }
        })

        const response = toUserResponse(user, userLogin.role)

        response.token = user.token!;
        return response
    }

    // get user token fir nuddkeware
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
        const result = UserValidation.UPDATE.safeParse(request)

        if (!result.success) {
            const messages = result.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

        if (request.name) {
            user.name = request.name
        }

        if (request.password) {
            user.password = await Bun.password.hash(request.password, {
                algorithm: 'bcrypt',
                cost: 10
            })
        }

        if (typeof request.roleId !== 'undefined') {
            user.role_id = request.roleId
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: user,
            include: {
                role: true
            }
        })

        return toUserResponse(user, updatedUser.role)
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
            include: {
                role: true
            },
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
            name: user.name,
            roleId: user.role_id ?? null,
            roleName: user.role?.role_name ?? null

        }))


        return {
            page: page,
            size: size,
            lastPage: Math.ceil(totalCount / size),
            totalCount: totalCount,
            data: transformedUsers
        }
    }

    static async deleteUser(id: number, user: User): Promise<boolean> {

        const userExist = await prismaClient.user.count({
            where: {
                id: id
            }
        })
        if (!userExist) {
            throw new HTTPException(400, {message: 'User not found'})
        }

        if(id === user.id){
            throw new HTTPException(400, {message: 'Cannot delete yourself'})
        }
        
        await prismaClient.user.delete({
            where: {
                id: id
            }
        })

        return true
    }

    static async getById(id: number): Promise<UserResponse> {

        id = UserValidation.GET.parse(id)

        const user = await prismaClient.user.findUnique({
            where: {
                id: id
            }, include: {
                role: true
            }
        })

        if (!user) {
            throw new HTTPException(400, {
                message: 'User not found'
            })
        }

        return toUserResponse(user, user.role)
    }

    static async updateById(id: number, request: UpdateUserRequest): Promise<UserResponse> {

        id = UserValidation.UPDATEBYID.parse(id)
        const req = UserValidation.UPDATE.safeParse(request)

        if (!req.success) {
            const messages = req.error.errors.map(e => e.message);
            throw new Error(messages.join(", "));
        }

        let user = await prismaClient.user.findFirst({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new HTTPException(400, {
                message: 'User not found'
            })
        }

        user = await prismaClient.user.update({
            where: {
                id: id
            }, data: {
                name: request.name,
                password: request.password,
                role_id: request.roleId
            }
        })

        return toUserResponse(user)
    }
}