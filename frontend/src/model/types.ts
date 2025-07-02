export interface Product {
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