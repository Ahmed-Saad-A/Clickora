"use client";
import { useApiService } from "@/hooks";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type CartContextProps = {
  cartCount: number;
  setCartCount: Dispatch<SetStateAction<number>>;
  isCartLoading: boolean;
  handleAddToCart: (
    productId: string,
    setIsAddingToCart: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
};

export const cartContext = createContext<CartContextProps>({
  cartCount: 0,
  setCartCount: () => {},
  isCartLoading: true,
  handleAddToCart: async () => {},
});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(true);
  const apiService = useApiService();
  const { data: session, status } = useSession();

  const getCart = useCallback(async (): Promise<void> => {
    setIsCartLoading(true);
    try {
      const response = await apiService.getUserCart();
      if (response && typeof response.numOfCartItems === "number") {
        setCartCount(response.numOfCartItems);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("getCart error:", err);
      setCartCount(0);
    } finally {
      setIsCartLoading(false);
    }
  }, [apiService]);


  useEffect(() => {
    if (status === "authenticated") {
      getCart();
    } else if (status === "unauthenticated") {
      setCartCount(0);
    }
  }, [status, getCart]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      const keysToListen = ["next-auth.session-token", "cart-updated", "auth-token"];
      if (keysToListen.includes(e.key ?? "")) {
        setTimeout(() => {
          getCart();
        }, 200);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [getCart]);

  const handleAddToCart = async (
    productId: string,
    setIsAddingToCart: Dispatch<SetStateAction<boolean>>
  ): Promise<void> => {
    try {
      setIsAddingToCart(true);
      const response = await apiService.addProductToCart(productId);
      if (response && typeof response.numOfCartItems === "number") {
        setCartCount(response.numOfCartItems);
      } else {
        await getCart();
      }
      toast.success(response.message || "Added to cart", {
        position: "bottom-right",
      });
      try {
        localStorage.setItem("cart-updated", String(Date.now()));
      } catch (e) {
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <cartContext.Provider
      value={{ cartCount, setCartCount, isCartLoading, handleAddToCart }}
    >
      {children}
    </cartContext.Provider>
  );
}
