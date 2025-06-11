// src/app/(marketing)/layout.tsx
"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/marketing/CartDrawer";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

const useHydratedCart = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const cartState = useCartStore();
  return hydrated ? cartState : { items: [], getTotalItems: () => 0 };
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useHydratedCart();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={getTotalItems()}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
