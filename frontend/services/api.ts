import {
  LoginRequest,
  LoginResponse,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Variant,
  CreateVariantRequest,
  UpdateVariantRequest,
  DeleteResponse,
  ApiError,
} from "@/types/api";
import { getToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "Network error occurred",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getVariants(productId?: string): Promise<Variant[]> {
    const endpoint = productId
      ? `/variants?productId=${productId}`
      : "/variants";
    return this.request<Variant[]>(endpoint);
  }

  async createVariant(data: CreateVariantRequest): Promise<Variant> {
    return this.request<Variant>("/variants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateVariant(
    id: string,
    data: UpdateVariantRequest
  ): Promise<Variant> {
    return this.request<Variant>(`/variants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteVariant(id: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`/variants/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
