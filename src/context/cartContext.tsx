"use client";
import { servicesApi } from "@/Services/api";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type cartContextProps = {
  cartCount?: number;
  setCartCount?: Dispatch<SetStateAction<number>>;
  isCartLoading?: boolean;
  handleAddToCart?: (productId: string, setIsAddingToCart: any) => void;
};

export const cartContext = createContext<cartContextProps>({});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);

  async function handleAddToCart(productId: string, setIsAddingToCart: any) {
    setIsAddingToCart(true);
    const response = await servicesApi.addProductToCart(productId);
    setCartCount!(response.numOfCartItems);
    setIsAddingToCart(false);
    toast.success(response.message, {
      position: "bottom-right",
    });
  }

  async function getCart() {
    const response = await servicesApi.getUserCart();
    setCartCount(response.numOfCartItems);
    setIsCartLoading(false);
  }

  useEffect(() => {
    getCart();
  }, []);

  return (
    <cartContext.Provider
      value={{ cartCount, setCartCount, isCartLoading, handleAddToCart }}
    >
      {children}
    </cartContext.Provider>
  );
}