
import { AddProductToCartResponse } from "@/interfaces/Cart";
import { ProductsResponse, SingleBrandResponse, SingleProductResponse } from "@/types";
import { promises } from "dns";


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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWYxMjJmZmUxZDBkYWEzOGQxNDhmZCIsIm5hbWUiOiJNb2hhbWVkIEFiZCBFbCBNb2F0eSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU2MzAzOTQzLCJleHAiOjE3NjQwNzk5NDN9.NckDzfKxU4EVmLKHg2GYR2lklfuKhAgEBKSr_b7VJ_U",
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
}
export const servicesApi = new ServicesApi();