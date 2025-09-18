"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { servicesApi } from "@/Services/api";
import { Brand } from "@/interfaces";
import { Button } from "@/components/ui";
import { Loader2, RefreshCw } from "lucide-react";

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBrands() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await servicesApi.getBrands();
      setBrands(res.data);
    } catch (e) {
      setError("Failed to load brands. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadBrands}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Brands</h1>
        <p className="text-muted-foreground mt-2">Explore our partner brands</p>
      </div>

      {brands.length === 0 ? (
        <div className="text-center text-muted-foreground">No brands found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={{ pathname: "/products", query: { brand: brand.slug } }}
              className="group border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow"
            >
              <div className="relative w-full aspect-square mb-3">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
              </div>
              <div className="text-center text-sm font-medium group-hover:text-primary">
                {brand.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsPage;