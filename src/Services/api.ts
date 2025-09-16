
import { AddProductToCartResponse, CartResponse } from "@/interfaces/Cart";
import { ProductsResponse, SingleBrandResponse, SingleProductResponse } from "@/types";
import { 
  AddressResponse, 
  CreateAddressRequest, 
  CreateAddressResponse 
} from "@/interfaces/address";
import { 
  CreateCashOrderRequest,
  CreateCashOrderResponse,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse
} from "@/interfaces/order";



const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

class ServicesApi {
  #baseUrl: string = "";
  constructor() {
    this.#baseUrl = baseUrl ?? "";
  }

  #getHeaders() {
    return {
      "content-type": "application/json",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzU0YzczMWQzZWE2NTRkNTcwM2UxYSIsIm5hbWUiOiJBaG1lZCBTYWFkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTc3ODgwNjgsImV4cCI6MTc2NTU2NDA2OH0.vpR-to00SNiQX2g3I_raofY_5_57NgQlNUIoBooQODs",
    };
  }

  async getAllProducts(): Promise<ProductsResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/products", {
      headers: this.#getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    return res.json();
  }

  async getProductDetails(productId: string): Promise<SingleProductResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/products/" + productId, {
      headers: this.#getHeaders(),
    });
    return res.json();
  }


  async addProductToCart(productId: string): Promise<AddProductToCartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart",{
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }


  async getUserCart(): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart",{
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }


  async removeCartItem(productId: string): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart/" + productId,{
        method: "DELETE",
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }


  async clearCart(): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart",{
        method: "DELETE",
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());  
  }

  async updateCartProductCount(productId: string, count: number): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart/" + productId,{
        method: "PUT",
        body: JSON.stringify({ count }),  
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());  
  }

  // Address APIs
  async getUserAddresses(): Promise<AddressResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/addresses",
      {
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async createAddress(addressData: CreateAddressRequest): Promise<CreateAddressResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/addresses",
      {
        method: "POST",
        body: JSON.stringify(addressData),
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  // Order APIs
  async createCashOrder(orderData: CreateCashOrderRequest): Promise<CreateCashOrderResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/orders",
      {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async createCheckoutSession(sessionData: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/orders/checkout-session",
      {
        method: "POST",
        body: JSON.stringify(sessionData),
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async signIn(email: string, password: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/signin",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

}


export const servicesApi = new ServicesApi();