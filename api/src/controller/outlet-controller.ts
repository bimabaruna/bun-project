import type { CreateRequestOutlet, OutletResponse } from "../model/outlet-model"
import { prismaClient } from "../application/database"
import { Hono } from "hono"
import type { ApplicationVariables } from "../model/app-model"
import { OutletService } from "../service/outlet-service"
import { authMiddleware } from "../middleware/auth-middleware"

export const outletController = new Hono<{ Variables: ApplicationVariables }>()

outletController.post('/outlets', authMiddleware, async (c) => {
    const request = await c.req.json() as CreateRequestOutlet

    const response = await OutletService.create(request)

    return c.json({
        data: response
    })
})

outletController.patch('/outlets/:id', authMiddleware, async (c) => {
    const outletId = c.req.param('id')
    const id = parseInt(outletId || '')
    const request = await c.req.json() as CreateRequestOutlet

    const response = await OutletService.update(id, request)

    return c.json({
        data: response
    })
})

outletController.get('/outlets', authMiddleware, async (c) => {
    const response = await OutletService.get()

    return c.json(response)
})

outletController.delete('/outlets/:id', authMiddleware, async (c) => {
    const outletId = c.req.param('id')

    const response = await OutletService.delete(Number(outletId))
    return c.json(response)
})