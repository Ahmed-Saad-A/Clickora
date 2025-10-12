
import { AddProductToCartResponse, CartResponse } from "@/interfaces/Cart";
import { ProductsResponse, SingleBrandResponse, SingleProductResponse } from "@/types";
import {
  AddressResponse,
  CreateAddressRequest,
  CreateAddressResponse
} from "@/interfaces/address";
import {
  Order,
  CreateCashOrderRequest,
  CreateCashOrderResponse,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse
} from "@/interfaces/order";
import { BrandsResponse } from "@/types";




const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

class ServicesApi {
  #baseUrl: string = "";
  #token: string | null = null;
  
  constructor() {
    this.#baseUrl = baseUrl || "https://ecommerce.routemisr.com/";
  }

  setToken(token: string | null) {
    this.#token = token;
  }

  #getHeaders() {
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    
    if (this.#token) {
      headers.token = this.#token;
    }
    
    return headers;
  }

  async getAllProducts(): Promise<ProductsResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/products", {
      headers: await this.#getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    return res.json();
  }

  async getProductDetails(productId: string): Promise<SingleProductResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/products/" + productId, {
      headers: await this.#getHeaders(),
    });
    return res.json();
  }


  async addProductToCart(productId: string): Promise<AddProductToCartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }


  async getUserCart(): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart", {
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }


  async removeCartItem(productId: string): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart/" + productId, {
      method: "DELETE",
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }


  async clearCart(): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart", {
      method: "DELETE",
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }

  async updateCartProductCount(productId: string, count: number): Promise<CartResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/cart/" + productId, {
      method: "PUT",
      body: JSON.stringify({ count }),
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }


  async getUserAddresses(): Promise<AddressResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/addresses",
      {
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async createAddress(addressData: CreateAddressRequest): Promise<CreateAddressResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/addresses",
      {
        method: "POST",
        body: JSON.stringify(addressData),
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async removeAddress(addressId: string): Promise<AddressResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/addresses/" + addressId,
      {
        method: "DELETE",
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async createCashOrder(orderData: CreateCashOrderRequest, cartId: string): Promise<CreateCashOrderResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/orders/" + cartId,
      {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async createCheckoutSession(sessionData: CreateCheckoutSessionRequest, cartId: string): Promise<CreateCheckoutSessionResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/orders/checkout-session/" + cartId + '?url=http://localhost:3000',
      {
        method: "POST",
        body: JSON.stringify(sessionData),
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async getUserOrders(userId: string): Promise<{ data: Order[] }> {
    return await fetch(
      this.#baseUrl + "api/v1/orders/user/" + userId,
      {
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async getBrands(): Promise<BrandsResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/brands", {
    });
    return res.json();
  }

  async getBrandDetails(brandId: string): Promise<SingleBrandResponse> {
    const res = await fetch(this.#baseUrl + "api/v1/brands/" + brandId, {
    });
    return res.json();
  }

  async getCategories(): Promise<{ data: { _id: string; name: string; slug: string; }[] }> {
    const res = await fetch(this.#baseUrl + "api/v1/categories", {
    });
    return res.json();
  }

  async getSpecificCategory(categoryId: string): Promise<{ data: { _id: string; name: string; slug: string; } }> {
    const res = await fetch(this.#baseUrl + "api/v1/categories/" + categoryId, {
    });
    return res.json();
  }

  async addWishlistItem(productId: string): Promise<{ status: "success" | "error"; message: string; }> {
    return await fetch(
      this.#baseUrl + "api/v1/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }

  async removeWishlistItem(productId: string): Promise<{ status: "success" | "error"; message: string; }> {
    return await fetch(
      this.#baseUrl + "api/v1/wishlist/" + productId, {
      method: "DELETE",
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }

  async getWishlist(): Promise<{ data: { _id: string; name: string; price: number; description: string; quantity: number; sold: number; images: string[]; category: { _id: string; name: string; slug: string; }; brand: { _id: string; name: string; slug: string; }; }[] }> {
    return await fetch(
      this.#baseUrl + "api/v1/wishlist", {
      headers: await this.#getHeaders(),
    }
    ).then((res) => res.json());
  }

  async signIn(email: string, password: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/signin",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async signUp(name: string, email: string, password: string, rePassword: string, phone: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password, rePassword, phone }),
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async forgotPassword(email: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/forgotPasswords",
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async verifyResetCode(resetCode: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/verifyResetCode",
      {
        method: "POST",
        body: JSON.stringify({ resetCode }),
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async updatePassword(currentPassword: string, Password: string, rePassword: string) {
    return await fetch(
      this.#baseUrl + "api/v1/users/changeMyPassword",
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, password: Password, rePassword }),
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async resetPassword(email: string, newPassword: string) {
    return await fetch(
      this.#baseUrl + "api/v1/auth/resetPassword",
      {
        method: "PUT",
        body: JSON.stringify({ email, newPassword }),
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
  }

  async updateUserProfile(name: string, email: string, phone: string) {
    return await fetch(
      this.#baseUrl + "api/v1/users/updateMe/",
      {
        method: "PUT",
        body: JSON.stringify({ name, email, phone }),
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }

  async verifyToken() {
    return await fetch(
      this.#baseUrl + "api/v1/auth/verifyToken",
      {
        headers: await this.#getHeaders(),
      }
    ).then((res) => res.json());
  }



}


export const servicesApi = new ServicesApi();