export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ProductResponse {
  page: number;
  size: number;
  data: Product[];
}