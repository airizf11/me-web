// src/app/(marketing)/layout.tsx
"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/marketing/CartDrawer";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { FloatingCartButton } from "@/components/marketing/FloatingCartButton";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItemCount = useCartStore((state) => state.getTotalItems());

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onCartClick={handleCartClick}
        cartItemCount={isHydrated ? cartItemCount : 0}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-grow">{children}</main>
      <Footer />

      {isHydrated && <FloatingCartButton onClick={handleCartClick} />}
    </div>
  );
}
