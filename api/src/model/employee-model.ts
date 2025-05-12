import type { Employee } from "@prisma/client"


export type EmployeeRequestModel = {
    username: string,
    fullName: string,
    password: string
    outletId: number,
    
}
export type EmployeeResponse = {
    id: number,
    name: string,
    username: string,
    outletId: number,
    token? : string
}

export type EmployeeUpdateModel = {
    username: string,
    fullName: string,
    password: string
    outletId: number,
}

export type EmployeeListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    data: EmployeeResponse[]
}

export function toEmployeeResponse(employee: Employee): EmployeeResponse {
    return {
        id: employee.id,
        username: employee.username,
        name: employee.name,
        outletId: employee.outlet_id
    }

}