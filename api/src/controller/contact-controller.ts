import { Hono } from "hono";
import { type RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import type { ApplicationVatiables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import { ContactService } from "../service/contact-service";
import type { CreateContactRequest, UpdateContactRequest } from "../model/contact-model";


export const contactController = new Hono<{ Variables: ApplicationVatiables }>()

contactController.use(authMiddleware)

contactController.post('/api/contacts', async (c) => {
    const user = c.get('user') as User

    const request = await c.req.json() as CreateContactRequest
    const response = await ContactService.create(user, request)

    return c.json({
        data: response
    })
})

contactController.get('/api/contacts/:id', async (c) => {
    const user = c.get('user') as User
    const contactId = Number(c.req.param("id"))

    const response = await ContactService.get(user, contactId)

    return c.json({
        data: response
    })
})

contactController.patch('/api/contacts', async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as UpdateContactRequest

    const response = await ContactService.update(user, request)
    return c.json({
        data: response
    })
})

contactController.delete('/api/contacts/:id', async (c) => {
    // const user = c.get('user') as User
    const contactId = Number(c.req.param("id"))
    const response = await ContactService.delete(contactId)

    return c.json({
        data: response
    })
})