import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { toUserResponse, type RegisterUserRequest, type UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";

export class UserService {

    static async register(request: RegisterUserRequest): Promise<UserResponse>{
        
        request = UserValidation.REGISTER.parse(request)

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
        })

        if(totalUserWithSameUsername != 0){
            throw new HTTPException(400,{
                message: "Username Already Exist!"
            })
        }

        request.password = await Bun.password.hash(request.password,{
            algorithm: "bcrypt",
            cost:10,
        })
        
        const user = await prismaClient.user.create({
            data: request
        })

        return toUserResponse(user)
    }
}