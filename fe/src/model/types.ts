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

// Represents a single stock movement item from the API (camelCase, with typo)
export interface ApiStockMovement {
    id: number;
    productId: number;
    productName: string;
    userId: number;
    username: string;
    quantity: number;
    movementType: string;
    orderId: number | null;
    quantityChange: number;
    quanityAfter: number; // Typo from API
    createdAt: string;
}

// Represents the API response object for a list of stock movements
export interface ApiStockMovementResponse {
    data: ApiStockMovement[];
}

// Represents a stock movement object as used within the application (snake_case)
export interface StockMovement {
    id: number;
    product_id: number;
    product_name: string;
    moved_by: string;
    quantity: number;
    movement_type: string;
    quantity_change: number;
    quantity_after: number;
    created_at: string;
}