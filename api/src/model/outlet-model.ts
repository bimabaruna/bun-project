import type { Outlet } from "@prisma/client";

export type CreateRequestOutlet = {
    outletName: string;
    outletAddress: string;
    phone: string;
}

export type updateRequestOutlet = {
    outletName: string;
    outletAddress: string;
    phone: string;
}

export type OutletResponse = {
    id: number;
    name: string;
    address: string;
    phone: string;
}

export function toOutletResponse(outlet: Outlet): OutletResponse {
    return {
        id: outlet.id,
        name: outlet.outlet_name,
        address: outlet.address,
        phone: outlet.phone
    }
}

export type OutletListResponse = {
    data: OutletResponse[];
}
