// src/components/marketing/AddToCartButton.tsx
"use client";

import { useCartStore } from "@/store/cart";
import { type MenuItem } from "@/lib/types";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

type AddToCartButtonProps = {
  item: MenuItem;
  text?: string;
  showIcon?: boolean;
  className?: string;
};

export function AddToCartButton({
  item,
  text = "Tambah ke Keranjang",
  showIcon = true,
  className = "px-6 py-2 bg-deep-mocha text-light-cream rounded-full font-body hover:bg-warm-brown transition-colors",
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center ${className}`}
    >
      {showIcon && <ShoppingCartIcon className="h-5 w-5 mr-2" />}
      {text}
    </button>
  );
}
