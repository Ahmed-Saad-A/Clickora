"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { servicesApi } from "@/Services/api";
import { Category } from "@/interfaces";
import { Button } from "@/components/ui";
import { Loader2, RefreshCw, Grid3X3, Package, ArrowRight } from "lucide-react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await servicesApi.getCategories();
      setCategories(res.data);
    } catch (e) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={loadCategories}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover amazing products organized by categories. Find exactly what you are looking for.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-20 w-20 mx-auto mb-6 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold mb-2">No Categories Available</h2>
          <p className="text-muted-foreground">Check back later for new categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={{ pathname: "/products", query: { category: category.slug } }}
              className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/20"
            >
              <div className="p-6">
                {/* Category Image */}
                <div className="relative w-full h-32 mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Category Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore products in this category
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                    <span>Browse Products</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {categories.length > 0 && (
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Cannot find what you are looking for?</h2>
            <p className="text-muted-foreground mb-6">
              Browse all our products or use our search feature to find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">View All Products</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;