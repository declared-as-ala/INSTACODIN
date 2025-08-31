export interface User {
  id: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  index: number;
}

export interface CreateProductRequest {
  name: string;
}

export interface UpdateProductRequest {
  name: string;
}

export interface Variant {
  id: string;
  name: string;
  product: string;
  productId: string;
  index: number;
  skuCode: string;
  createdBy: string;
}

export interface CreateVariantRequest {
  name: string;
  productId: string;
}

export interface UpdateVariantRequest {
  name: string;
}

export interface DeleteResponse {
  id: string;
  deleted: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
