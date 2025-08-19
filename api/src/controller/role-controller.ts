import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import type { ApplicationVariables } from "../model/app-model";
import type { CreateRoleRequest } from "../model/role-model";
import { RoleService } from "../service/role-service";

export const roleController = new Hono<{ Variables: ApplicationVariables }>()

roleController.post('/roles', async (c) => {

    const request = await c.req.json() as CreateRoleRequest

    const response = await RoleService.create(request)

    return c.json({
        data: response
    })
})

roleController.get('/roles', authMiddleware, async (c) => {
    const response = await RoleService.get()

    return c.json(response)
})

roleController.delete('/roles/:id', authMiddleware, async (c) => {
    const roleId = c.req.param('id')

    const response = await RoleService.delete(Number(roleId))
    return c.json(response)
})