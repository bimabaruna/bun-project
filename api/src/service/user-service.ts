import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UserListResponse, type UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { sign, verify } from "hono/jwt";
import type { User } from "@prisma/client";
import { tokenToString } from "typescript";

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

        request = UserValidation.LOGIN.parse(request)

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

        const token = await sign(user, JWT_SECRET)

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

    static async get(token: string | undefined | null): Promise<User>{

        token = UserValidation.TOKEN.parse(token)

        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        })

        if(!user){
            throw new HTTPException(401,{
                message:'Unathorized'
            })
        }

        return user
    }

    static async getList(token: string | undefined | null): Promise<UserListResponse>{

        token = UserValidation.USER_LIST.parse(token)
        

        let user = await prismaClient.user.findFirst({
        where:{
                token: token
            }
        })

        if (!user) {
            throw new HTTPException(401,{
                message: 'Unathorized'
            })
        }
        
        const userList = await prismaClient.user.findMany({
        })

        const transformedUsers = userList.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name
          }))

        return {
            data: transformedUsers
        }
    }
}