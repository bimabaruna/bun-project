import { Hono } from "hono";
import { toUserResponse, type LoginUserRequest, type RegisterUserRequest, type UpdateUserRequest, type UserListResponse } from "../model/user-model";
import { UserService } from "../service/user-service";
import { isNamedExportBindings } from "typescript";
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { date } from "zod";
import { authMiddleware } from "../middleware/auth-middleware";


export const userController = new Hono<{ Variables: ApplicationVariables }>()


userController.post('/users', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.register(request)

    return c.json({
        data: response
    })
})

userController.post('/users/login', async (c) => {
    const request = await c.req.json() as LoginUserRequest;

    const response = await UserService.login(request)

    return c.json({
        data: response
    })
})

// userController.use(authMiddleware)

userController.get('/users/user', authMiddleware, async (c) => {

    const user = c.get('user') as User

    return c.json({
        data: toUserResponse(user)
    })
})

userController.get('/users', authMiddleware, async (c) => {
    const size = Number(c.req.query('size'))
    const page = Number(c.req.query('page'))
    const username = c.req.query('username')

    const users = await UserService.getList(page, size, username)

    return c.json(users);
});

userController.patch('/users/user', authMiddleware, async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as UpdateUserRequest

    const response = await UserService.update(user, request)
    return c.json({
        data: response
    })
})

// userController.delete('/users/user', authMiddleware, async (c) => {
//     const user = c.get('user') as User

//     const response = await UserService.logout(user)
//     return c.json({
//         data: response
//     })
// })

userController.delete('/users', authMiddleware, async (c) => {
    const idParam = c.req.query('id');
    const id = parseInt(idParam || '');
    const user = c.get('user') as User
    const response = await UserService.deleteUser(id, user)

    return c.json({
        data: response
    })
})

userController.get('/users/:id', authMiddleware, async (c) => {
    const idParam = c.req.param('id');
    const id = parseInt(idParam || '');
    const response = await UserService.getById(id)

    return c.json({
        data: response
    })
})

userController.patch('/users/:id', authMiddleware, async (c) => {
    const idParam = c.req.param('id');
    const id = parseInt(idParam || '');
    const request = await c.req.json() as UpdateUserRequest

    const response = await UserService.updateById(id, request)

    return c.json({
        data: response

    })
})