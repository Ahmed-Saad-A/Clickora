"use client";

import React, { useEffect, useState } from "react";
import InnerCart from "./InnerCart";
import { useApiService } from "@/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { CartResponse } from "@/interfaces/Cart";

export default function Cart() {
  const apiService = useApiService();
  const { status } = useSession();
  const router = useRouter();
  const [response, setResponse] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      setError(null);
      apiService
        .getUserCart()
        .then((res) => setResponse(res))
        .catch(() => setError("Failed to load cart"))
        .finally(() => setIsLoading(false));
    } else if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, apiService, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <InnerCart response={response} />
    </div>
  );
}