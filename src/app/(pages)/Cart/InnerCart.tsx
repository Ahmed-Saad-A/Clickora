"use client";

import { Button } from "@/components";
import CartProduct from "@/components/products/CartProduct";
import { cartContext } from "@/context/cartContext";
import { formatPrice } from "@/helpers/currency";
import { CartResponse } from "@/interfaces/Cart";
import { servicesApi } from "@/Services/api";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

interface InnerCartProps {
  response: CartResponse;
}

const InnerCart = ({ response }: InnerCartProps) => {
  const [innerResponse, setInnerResponse] = useState(response);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const { setCartCount } = useContext(cartContext);


    useEffect(() => {
    setCartCount!(innerResponse.numOfCartItems);
  }, [innerResponse]);

    async function handleClearCart() {
    setIsClearingCart(true);
    const response = await servicesApi.clearCart();
    setInnerResponse({ ...innerResponse, numOfCartItems: 0 });
    setIsClearingCart(false);
  }


  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {response.numOfCartItems} item
          {response.numOfCartItems !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {response.data.products.map((item) => (
              <CartProduct key={item._id} item={item} setInnerResponse ={setInnerResponse} />
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6">
            <Button onClick={handleClearCart} disabled= {isClearingCart} variant="outline">
               {isClearingCart ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({response.numOfCartItems} items)</span>
                <span>{formatPrice(response.data.totalCartPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(response.data.totalCartPrice)}</span>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/Address">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InnerCart;
