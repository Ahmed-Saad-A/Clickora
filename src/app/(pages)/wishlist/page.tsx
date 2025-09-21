"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/products/ProductCard";
import { 
  Heart, 
  Loader2, 
  ArrowLeft
} from "lucide-react";
import { wishlistContext } from "@/context/wishlistContext";

const WishlistPage = () => {
  const { wishlistItems, isWishlistLoading } = useContext(wishlistContext);

  if (isWishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in your wishlist
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-20 w-20 mx-auto mb-6 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start adding items you love to your wishlist
          </p>
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              viewMode="grid" 
            />
          ))}
        </div>
      )}

      {/* Call to Action */}
      {wishlistItems.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to make a purchase?</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart and proceed to checkout
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;