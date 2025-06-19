// src/components/marketing/FloatingCartButton.tsx
"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

type FloatingCartButtonProps = {
  onClick: () => void;
};

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 bg-deep-mocha text-light-cream h-16 w-16 rounded-full shadow-lg flex items-center justify-center
                     lg:hidden"
          aria-label={`Buka keranjang, ${totalItems} item`}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <ShoppingCartIcon className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-deep-mocha">
            {totalItems}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
