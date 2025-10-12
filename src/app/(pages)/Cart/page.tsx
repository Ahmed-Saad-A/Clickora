
import { servicesApi } from "@/Services/api";
import React from "react";
import InnerCart from "./InnerCart";


export default async function Cart() {
  async function getUserCart() {
    const response = await servicesApi.getUserCart();
    console.log("🚀 ~ getUserCart ~ response:", response)
    return response;
  }

  const response = await getUserCart();
  console.log("🚀 ~ Cart ~ response:", response)

  return (
    <div className="container mx-auto px-4 py-8">
      <InnerCart response={response} />
    </div>
  );
}