"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { servicesApi } from "@/Services/api";
import { Product } from "@/interfaces";
import toast from "react-hot-toast";

interface WishlistContextProps {
  wishlistItems: Product[];
  isWishlistLoading: boolean;
  toggleWishlistItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const wishlistContext = createContext<WishlistContextProps>({});

export default function WishlistContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item._id === productId);
  };

  const toggleWishlistItem = async (productId: string) => {
    try {
      if (isInWishlist(productId)) {
        // Remove from wishlist
        await servicesApi.removeWishlistItem(productId);
        setWishlistItems(prev => prev.filter(item => item._id !== productId));
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await servicesApi.addWishlistItem(productId);
        // Note: We'll need to fetch the product details to add to wishlist
        // For now, we'll just show success and reload the wishlist
        toast.success("Added to wishlist");
        loadWishlist();
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const loadWishlist = async () => {
    try {
      setIsWishlistLoading(true);
      const response = await servicesApi.getWishlist();
      // Transform the API response to match Product interface
      const products: Product[] = response.data.map(item => ({
  _id: item._id,
  id: item._id,
  title: item.title,
  description: item.description,
  price: item.price,
  quantity: item.quantity,
  sold: item.sold,
  imageCover: item.imageCover || item.images[0] || "",
  images: item.images || [],
  ratingsAverage: item.ratingsAverage || 0,
  ratingsQuantity: item.ratingsQuantity || 0,
  brand: item.brand,
  category: item.category,
  subcategory: item.subcategory || [],
}));

      setWishlistItems(products);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

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


