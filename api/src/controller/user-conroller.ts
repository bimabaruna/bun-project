import { Hono } from "hono";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UserListResponse } from "../model/user-model";
import { UserService } from "../service/user-service";
import { isNamedExportBindings } from "typescript";
import type { ApplicationVatiables } from "../model/app-model";
import type { User } from "@prisma/client";


export const userController = new Hono<{ Variables: ApplicationVatiables }>()


userController.post('/api/users', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.register(request)

    return c.json({
        data: response
    })
})

userController.post('/api/users/login', async (c) => {
    const request = await c.req.json() as LoginUserRequest;

    const response = await UserService.login(request)

    return c.json({
        data: response
    })
})

userController.use(async (c, next) => {
    const token = c.req.header('Authorization')
    const user = await UserService.get(token)
    const userListResponse = await UserService.getList(token)

    c.set('user', user);
    c.set('users', userListResponse.data );

    await next()

})

userController.get('/api/users/user', async (c) => {

    const user = c.get('user') as User

    return c.json({
        data: toUserResponse(user)
    })
})

userController.get('/api/users', async (c) => {
    const users = c.get('users')
    return c.json({
        data: users
    });
});
