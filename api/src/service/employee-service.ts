import { password } from "bun";
import { prismaClient } from "../application/database";
import { toEmployeeResponse, type EmployeeListResponse, type EmployeeRequestModel, type EmployeeResponse, type EmployeeUpdateModel } from "../model/employee-model";
import { employeeValidation } from "../validation/employee-validation";
import { toUserResponse } from "../model/user-model";
import { connect } from "http2";
import { HTTPException } from "hono/http-exception";
import type { User } from '@prisma/client';


export class EmployeeService {


    static async create(user: User, request: EmployeeRequestModel): Promise<EmployeeResponse> {

        const req = employeeValidation.CREATE.safeParse(request);

        const userExist = await prismaClient.user.findFirst({
            where: {
                id: request.userId
            }
        })

        if (!userExist) {
            throw new HTTPException(400, {
                message: 'User not found'
            })
        }
        const outletExist = await prismaClient.outlet.findFirst({
            where: {
                id: request.outletId
            }
        })
        if (!outletExist) {
            throw new HTTPException(400, {
                message: 'Outlet not found'
            })
        }

        const employeeExist = await prismaClient.employeeDetails.findFirst({
            where: {
                user_id: request.userId
            }
        })

        if (employeeExist) {
            throw new HTTPException(400, {
                message: 'Employee already have an employee account'
            })
        }

        const employee = await prismaClient.employeeDetails.create({
            data: {
                user_id: request.userId,
                outlet_id: request.outletId,
                first_name: request.firstName,
                last_name: request.lastName,
                email: request.email,
                phone: request.phone,
                position: request.position,
                salary: request.salary,
            }, include: {
                outlet: true
            }
        })

        return toEmployeeResponse(employee)
    }

    // static async getList(page: number, size: number, employeeName?: string): Promise<EmployeeListResponse> {
    //     const pageNumber = Math.max(1, page)
    //     const skip = (pageNumber - 1) * size

    //     const [employeeList, totalCount] = await Promise.all([prismaClient.employeeDetails.findMany({
    //         where: {
    //             is_deleted: false,
    //             ...(employeeName ? {
    //                 is_deleted: false,
    //                 name: {
    //                     contains: employeeName,
    //                     mode: 'insensitive'
    //                 }
    //             } : {}),
    //         },
    //         include: {
    //             outlet: true
    //         },
    //         skip: skip,
    //         take: size
    //     }), prismaClient.employeeDetails.count({
    //         where: {
    //             is_deleted: false,
    //             ...(employeeName ? {
    //                 is_deleted: false,
    //                 name: {
    //                     contains: employeeName,
    //                     mode: 'insensitive'
    //                 }
    //             } : {}),
    //         }
    //     })

    //     ])

    //     const mapped = employeeList.map((employee) => toEmployeeResponse(employee))

    //     return {
    //         page: page,
    //         size: size,
    //         totalCount,
    //         lastPage: Math.ceil(totalCount / size),
    //         data: mapped
    //     }
    // }

    static async update(user: User, employeeId: number, request: EmployeeUpdateModel): Promise<EmployeeResponse> {

        const result = employeeValidation.UPDATE.safeParse(request)

        let employee = await prismaClient.employeeDetails.findFirst({
            where: {
                id: employeeId
            }
        })

        if (!employee) {
            throw new HTTPException(400, {
                message: 'Employee not found'
            })
        }

        employee = await prismaClient.employeeDetails.update({
            where: {
                id: employeeId
            }, data: {
                user_id: request.userId,
                outlet_id: request.outletId,
                first_name: request.firstName,
                last_name: request.lastName,
                email: request.email,
                phone: request.phone,
                position: request.position,
                salary: request.salary,
            }, include: {
                outlet: true

            }
        })

        return toEmployeeResponse(employee)
    }

    // static async delete(user: User, employeeId: number): Promise<{}> {

    //     const employeeExist = await prismaClient.employeeDetails.count({
    //         where: {
    //             id: employeeId
    //         }
    //     })

    //     if (!employeeExist) {
    //         throw new HTTPException(400, { message: "Employee not found" })
    //     }
    //     const date = new Date().toISOString();
    //     await prismaClient.employeeDetails.update({
    //         where: {
    //             id: employeeId
    //         }, data: {
    //             deleted_at: date.toString(),
    //             deleted_by: user.name,
    //             is_deleted: true
    //         }
    //     })

    //     return {
    //         message: 'Successfully deleted the product.'
    //     }

    // }
}