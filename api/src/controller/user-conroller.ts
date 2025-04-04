import { Hono } from "hono";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UpdateUserRequest, type UserListResponse } from "../model/user-model";
import { UserService } from "../service/user-service";
import { isNamedExportBindings } from "typescript";
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { date } from "zod";
import { authMiddleware } from "../middleware/auth-middleware";


export const userController = new Hono<{ Variables: ApplicationVariables }>()


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

userController.use(authMiddleware)

userController.get('/api/users/user', async (c) => {

    const user = c.get('user') as User

    return c.json({
        data: toUserResponse(user)
    })
})

userController.get('/api/users', async (c) => {
    const users = await UserService.getList()

    return c.json(users);
});

userController.patch('/api/users/user', async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as UpdateUserRequest

    const response = await UserService.update(user, request)
    return c.json({
        data: response
    })
})

userController.delete('/api/users/user', async (c) => {
    const user = c.get('user') as User

    const response = await UserService.logout(user)
    return c.json({
        data: response
    })
})

userController.delete('/api/users/', async (c) => {
    const idParam = c.req.query('id'); // Grab the query parameter
    const id = parseInt(idParam || '');
    const response = await UserService.deleteUser(id)

    return c.json({
        data: response
    })
})