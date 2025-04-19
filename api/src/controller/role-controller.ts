import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import type { ApplicationVariables } from "../model/app-model";
import type { CreateRoleRequest } from "../model/role-model";
import { RoleService } from "../service/role-service";

export const roleController = new Hono<{ Variables: ApplicationVariables }>()

roleController.post('/roles', authMiddleware, async (c)=>{

    const request = await c.req.json() as CreateRoleRequest

    const response = await RoleService.create(request)

    return c.json({
        data: response
    })
})

roleController.get('/roles', authMiddleware, async (c)=>{
    const response = await RoleService.get()

    return c.json(response)
})