// src/components/marketing/AddToCartButton.tsx
"use client";

import { useCartStore } from "@/store/cart";
import { type MenuItem } from "@/lib/types";
import { ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type AddToCartButtonProps = {
  item: MenuItem;
  text?: string;
  className?: string;
};

export function AddToCartButton({
  item,
  text = "Tambah ke Keranjang",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (added) return;

    addItem(item);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const baseClasses =
    "flex items-center justify-center rounded-full font-body transition-colors duration-300";
  const defaultColorClasses =
    "bg-deep-mocha text-light-cream hover:bg-warm-brown";
  const addedColorClasses = "bg-green-600 hover:bg-green-700 text-white";

  return (
    <button
      onClick={handleAddToCart}
      className={clsx(
        baseClasses,
        added ? addedColorClasses : defaultColorClasses,
        className
      )}
      disabled={added}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Ditambahkan!
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
