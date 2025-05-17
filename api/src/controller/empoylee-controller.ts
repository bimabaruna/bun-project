import { Hono } from "hono";
import type { ApplicationVariables } from "../model/app-model";
import type { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import { ContactService } from "../service/contact-service";
import type { CreateContactRequest, UpdateContactRequest } from "../model/contact-model";
import type { EmployeeRequestModel, EmployeeUpdateModel } from "../model/employee-model";
import { EmployeeService } from "../service/employee-service";
import { EmptyState } from "../../../frontend/src/components/EmptyState";

export const employeeController = new Hono<{ Variables: ApplicationVariables }>()

employeeController.post('/employee', authMiddleware, async (c) => {


    const request = await c.req.json() as EmployeeRequestModel;
    const user = c.get('user') as User

    const response = await EmployeeService.create(user, request)

    return c.json({
        data: response
    })
})


employeeController.patch('/employee/:id', authMiddleware, async (c) => {
    const employeeId = Number(c.req.param('id'))
    const request = await c.req.json() as EmployeeUpdateModel
    const user = c.get('user') as User

    const response = await EmployeeService.update(user, employeeId, request)

    return c.json({
        data: response
    })
})

