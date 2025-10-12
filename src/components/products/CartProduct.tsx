"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/helpers/currency";
import {
  CartItem,
  CartProduct as CartProductI,
  CartResponse,
} from "@/interfaces/Cart";
import { servicesApi } from "@/Services/api";
import { useDebounce } from "@uidotdev/usehooks";

interface CartProductProps {
  item: CartItem<CartProductI>;
  setInnerResponse: React.Dispatch<React.SetStateAction<CartResponse>>;
}

const CartProduct = ({ item, setInnerResponse }: CartProductProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [itemCount, setItemCount] = useState(item.count);

  const delayItemCount = useDebounce(itemCount, 500);

  async function handleRemoveItem() {
    setIsRemoving(true);
    const newResponse = await servicesApi.removeCartItem(item.product._id);
    setInnerResponse(newResponse);
    setIsRemoving(false);
  }

  async function handleUpdateCount(count: number) {

    const response = await servicesApi.updateCartProductCount(item.product._id, count);
    
    setInnerResponse(response);
    console.log("🚀 ~ handleUpdateCount ~ response:", response.data.products);
    setItemCount(count);
    console.log("🚀 ~ handleUpdateCount ~ setItemCount(count);:", setItemCount(count))
    console.log(item.count);
    
  }

  // useEffect(() => {
  //   const updateCart = async () => {
  //     if (delayItemCount !== item.count) {
  //       const response = await servicesApi.updateCartProductCount(
  //         item.product._id,
  //         delayItemCount
  //       );
  //        setInnerResponse({
  //       status: response.status,
  //       numOfCartItems: response.numOfCartItems,
  //       cartId: response.cartId,
  //       data: response.data, // data هي CartData<CartProduct>
  //     });
  //       console.log("🚀 ~ updateCart ~ response:", response)
  //     }
  //   };
  //   updateCart();
  // }, [delayItemCount]);

  return (
    <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.imageCover}
          alt={item.product.title}
          fill
          className="object-cover rounded-md"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold line-clamp-2">
          <Link
            href={`/products/${item.product.id}`}
            className="hover:text-primary transition-colors"
          >
            {item.product.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {item.product.brand?.name}
        </p>
        <p className="font-semibold text-primary mt-2">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Button onClick={handleRemoveItem} variant="ghost" size="sm">
          {isRemoving ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            disabled={itemCount <= 1}
            onClick={() => handleUpdateCount(itemCount - 1)}
            variant="outline"
            size="sm"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.count}</span>
          <Button
            disabled={itemCount == item.product.quantity}
            onClick={() => handleUpdateCount(itemCount + 1)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
