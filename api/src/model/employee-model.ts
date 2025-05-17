import type { EmployeeDetails } from "@prisma/client"


export type EmployeeRequestModel = {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    position: string,
    salary: number,
    outletId: number,

}
export type EmployeeResponse = {
    userId: number,
    firstName: string,
    lastName: string | undefined,
    email: string,
    phone: string,
    position: string,
    salary: number,
    outletId?: number | null,
}

export type EmployeeUpdateModel = {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    position: string,
    salary: number,
    outletId: number,
}

export type EmployeeListResponse = {
    page: number,
    size: number,
    totalCount: number,
    lastPage: number,
    data: EmployeeResponse[]
}

export function toEmployeeResponse(employee: EmployeeDetails): EmployeeResponse {
    return {
        userId: employee.id,
        outletId: employee.outlet_id ?? null,
        firstName: employee.first_name,
        lastName: employee.last_name ?? undefined,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        salary: Number(employee.salary),
    }
}