// src/components/marketing/checkout/CheckoutItem.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useCartStore, type CartItem } from "@/store/cart";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface CheckoutItemProps {
  item: CartItem;
}

export function CheckoutItem({ item }: CheckoutItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemoveItem = () => {
    removeItem(item.id);
    toast.error(`${item.name} dihapus dari keranjang.`);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  return (
    <li className="flex items-start py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-clay-pink/50">
        <Image
          src={item.image_url || "/images/menu-placeholder.jpg"}
          alt={item.name}
          width={80}
          height={80}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <h3 className="text-base font-medium text-deep-mocha">{item.name}</h3>
          <p className="mt-1 text-sm text-warm-brown">
            {formatCurrency(item.price)}
          </p>
        </div>
        <div className="mt-2 flex flex-1 items-center justify-between text-sm">
          <div className="flex items-center space-x-2 border border-clay-pink rounded-full p-1">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="p-1 text-deep-mocha hover:bg-clay-pink/50 rounded-full"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="text-gray-900 w-6 text-center font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="p-1 text-deep-mocha hover:bg-clay-pink/50 rounded-full"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <span className="font-semibold text-deep-mocha">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}
