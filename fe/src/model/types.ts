export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    categoryName: string;
    outletName: string;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    categoryName: string;
    outletName: string;
}

export interface ProductResponse {
    page: number;
    size: number;
    totalCount: number;
    lastPage: number;
    data: Product[];
}

export interface Category {
    id: number;
    categoryName: string;
}

export interface CategoryResponse {
    data: Category[];
}

export interface Outlet {
    id: number;
    name: string;
    address: string;
    phone: string;
}

export interface OutletResponse {
    data: Outlet[];
}

export interface OutletRequest {
    outletName: string,
    outletAddress: string,
    phone: number
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    product_name: string;
}

export interface Order {
    id: number;
    cashier_id: number;
    status: string;
    items: OrderItem[];
    total_price: string;
}

export interface OrderResponse {
    page: number;
    size: number;
    totalOrder: number;
    lastPage: number;
    data: Order[];
}

export interface User {
    id: number;
    name: string;
    username: string;
    roleId: number;
    roleName: string;
    userDetails: [];
}

export interface UserListResponse {
    page: number;
    size: number;
    lastPage: number;
    totalCount: number;
    data: User[];
}