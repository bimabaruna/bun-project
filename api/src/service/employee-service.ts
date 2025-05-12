import { password } from "bun";
import { prismaClient } from "../application/database";
import { toEmployeeResponse, type EmployeeListResponse, type EmployeeRequestModel, type EmployeeResponse } from "../model/employee-model";
import { employeeValidation } from "../validation/employee-validation";
import { toUserResponse } from "../model/user-model";
import { connect } from "http2";
import { HTTPException } from "hono/http-exception";
import type { User } from '@prisma/client';


export class EmployeeService {


    static async create(user: User, request: EmployeeRequestModel): Promise<EmployeeResponse> {

        const req = employeeValidation.CREATE.safeParse(request)

        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        const employee = await prismaClient.employee.create({
            data: {
                username: request.username,
                name: request.fullName,
                password: request.password,
                craetedBy: user.name,
                outlet: {
                    connect: {
                        id: request.outletId
                    }
                }
            }, include: {
                outlet: true
            }
        })

        return toEmployeeResponse(employee)
    }

    static async getList(page: number, size: number, employeeName?: string): Promise<EmployeeListResponse> {
        const pageNumber = Math.max(1, page)
        const skip = (pageNumber - 1) * size

        const [employeeList, totalCount] = await Promise.all([prismaClient.employee.findMany({
            where: { is_deleted: false,
              ...(employeeName ? {
                is_deleted: false,
                name: {
                    contains: employeeName,
                    mode: 'insensitive'
                }
            } : {}),
        } ,
            include: {
                outlet: true
            },
            skip: skip,
            take: size
        }), prismaClient.employee.count({
            where: { is_deleted: false,
                ...(employeeName ? {
                  is_deleted: false,
                  name: {
                      contains: employeeName,
                      mode: 'insensitive'
                  }
              } : {}),
          } 
        })

        ])

        const mapped = employeeList.map((employee)=> toEmployeeResponse(employee))

        return {
            page: page,
            size: size,
            totalCount,
            lastPage: Math.ceil(totalCount/size),
            data: mapped
        }
    }

    static async update(user: User, employeeId : number, request: EmployeeRequestModel): Promise<EmployeeResponse>{

        const result = employeeValidation.UPDATE.safeParse(request)

        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        let employee = await prismaClient.employee.findFirst({
            where: {
                is_deleted: false,
                id: employeeId
            }
        })
        
        if(!employee){
            throw new HTTPException(400, {
                message: 'Employee not found'
            })
        }

        employee = await prismaClient.employee.update({
            where:{
                id: employeeId
            }, data: {
                username: request.username,
                name: request.fullName,
                password: request.password,
                updated_by: user.name,
                outlet: {
                    connect: {
                        id: request.outletId
                    }
                }
            }, include: {
                outlet: true
                
            }
        })

        return toEmployeeResponse(employee)
    }

    static async delete(user: User, employeeId: number ): Promise<{}>{

        const employeeExist = await prismaClient.employee.count({
            where:{
                id: employeeId
            }
        })

        if(!employeeExist){
            throw new HTTPException(400, { message: "Employee not found"})
        }
        const date = new Date().toISOString();
        await prismaClient.employee.update({
            where: {
                id: employeeId
            }, data:{
                deleted_at: date.toString(),
                deleted_by: user.name,
                is_deleted: true
            }
        })

        return {
            message: 'Successfully deleted the product.'
        }

    }
}