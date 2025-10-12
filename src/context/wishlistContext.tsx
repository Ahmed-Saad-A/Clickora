"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useApiService } from "@/hooks";
import { Product, RawWishlistItem } from "@/interfaces";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface WishlistContextProps {
  wishlistItems: Product[];
  isWishlistLoading: boolean;
  toggleWishlistItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const wishlistContext = createContext<WishlistContextProps>({
  wishlistItems: [],
  isWishlistLoading: true,
  toggleWishlistItem: async () => { },
  isInWishlist: () => false,
});

export default function WishlistContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState<boolean>(true);
  const apiService = useApiService();
  const { status } = useSession();

  // ✅ mapper آمن
  const mapToProduct = (item: RawWishlistItem): Product => ({
    _id: item._id,
    id: item._id,
    title: item.title || item.name || "Untitled",
    description: item.description || "",
    price: item.price ?? 0,
    quantity: item.quantity ?? 0,
    sold: item.sold ?? 0,
    imageCover: item.imageCover || item.images?.[0] || "",
    images: item.images || [],
    ratingsAverage: item.ratingsAverage ?? 0,
    ratingsQuantity: item.ratingsQuantity ?? 0,

    // 🔹 Brand
    brand: {
      _id: item.brand?._id ?? "",
      name: item.brand?.name ?? "",
      slug: "default-brand", // لازم slug علشان نوع Brand بيطلبه
      image: "", // برضو default علشان النوع الداخلي بيتطلبه
    },

    // 🔹 Category
    category: {
      _id: item.category?._id ?? "",
      name: item.category?.name ?? "",
      slug: item.category?.slug ?? "default-category",
      image: "",
    },

    // 🔹 Subcategory array
    subcategory:
      item.subcategory?.map((sub) => ({
        _id: sub._id,
        name: sub.name,
        slug: sub.slug ?? "default-sub",
        category: item.category?._id ?? "", // بيربطها بالـ category لو موجود
      })) || [],

    slug: item.slug || "",
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || "",
  });

  const loadWishlist = useCallback(async () => {
    try {
      setIsWishlistLoading(true);
      const response = await apiService.getWishlist();

      if (!response?.data || !Array.isArray(response.data)) {
        console.warn("Unexpected wishlist response:", response);
        setWishlistItems([]);
        return;
      }

      // ✅ هنا التحويل باستخدام الماب الجديد
      const products: Product[] = response.data.map(mapToProduct);
      setWishlistItems(products);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("Failed to load wishlist");
      setWishlistItems([]);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    if (status === "authenticated") {
      loadWishlist();
    } else if (status === "unauthenticated") {
      setWishlistItems([]);
    }
  }, [status, loadWishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlistItem = async (productId: string) => {
    try {
      if (isInWishlist(productId)) {
        await apiService.removeWishlistItem(productId);
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
        toast.success("Removed from wishlist");
      } else {
        await apiService.addWishlistItem(productId);
        toast.success("Added to wishlist");
        await loadWishlist();
      }

      localStorage.setItem("wishlist-updated", String(Date.now()));
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist");
    }
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist-updated") {
        loadWishlist();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadWishlist]);

  return (
    <wishlistContext.Provider
      value={{
        wishlistItems,
        isWishlistLoading,
        toggleWishlistItem,
        isInWishlist,
      }}
    >
      {children}
    </wishlistContext.Provider>
  );
}
