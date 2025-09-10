
import { servicesApi } from "@/Services/api";
import React from "react";
import InnerCart from "./InnerCart";


export default async function Cart() {
  async function getUserCart() {
    const response = await servicesApi.getUserCart();
    return response;
  }

  const response = await getUserCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <InnerCart response={response} />
    </div>
  );
}