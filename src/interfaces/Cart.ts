import { Brand } from "./brand";
import { Category, Subcategory } from "./category";

export interface AddProductToCartResponse {
    status: string;
    message: string;
    numOfCartItems: number;
    cartId: string;
    data: CartData<string>;
}

export interface CartResponse {
    status: string;
    numOfCartItems: number;
    cartId: string;
    data: CartData<CartProduct>;
}

interface CartData<T> {
    _id: string;
    cartOwner: string;
    products: CartItem<T>[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    totalCartPrice: number;
}

export interface CartItem<T> {
    count: number;
    _id: string;
    product: T;
    price: number;
}

export interface CartProduct {
    subcategory: Subcategory[];
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    id: string;
}