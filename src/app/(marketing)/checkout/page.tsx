// src/app/(marketing)/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { CheckoutItem } from "@/components/marketing/checkout/CheckoutItem";
import { CheckoutForm } from "@/components/marketing/checkout/CheckoutForm";
import {
  ArrowLeftIcon,
  SparklesIcon,
  TagIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      toast.error("Keranjangmu kosong. Silakan pilih menu terlebih dahulu.");
      router.push("/menu");
    }
  }, [items, router]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-light-cream text-deep-mocha p-8 text-center">
        <SparklesIcon className="h-16 w-16 text-warm-brown animate-pulse" />
        <p className="mt-4 font-body">Mempersiapkan halaman checkout...</p>
      </div>
    );
  }

  return (
    <div className="bg-light-cream min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display lowercase text-deep-mocha">
            Checkout
          </h1>
          <p className="mt-2 text-lg font-body text-warm-brown">
            Satu langkah lagi untuk menikmati momen reflektifmu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          <div className="lg:order-1">
            <div className="bg-white/50 p-6 rounded-xl shadow-sm border border-clay-pink/30">
              <h2 className="text-2xl font-display lowercase text-deep-mocha border-b border-clay-pink/50 pb-4 mb-4">
                Ringkasan Pesanan
              </h2>

              <ul className="divide-y divide-clay-pink/30 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <CheckoutItem key={item.id} item={item} />
                ))}
              </ul>

              <div className="mt-4">
                <Link
                  href="/menu"
                  className="w-full flex items-center justify-center p-3 rounded-md text-deep-mocha bg-clay-pink/40 hover:bg-clay-pink/70 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Tambah atau ubah menu lain
                </Link>
              </div>

              <div className="mt-6 space-y-4 border-t border-clay-pink/50 pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Masukkan kode promo"
                    className="flex-grow p-3 rounded-md bg-light-cream border border-clay-pink text-deep-mocha focus:ring-2 focus:ring-deep-mocha"
                  />
                  <button className="p-3 rounded-md bg-warm-brown text-light-cream hover:bg-deep-mocha transition-colors">
                    <TagIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex justify-between text-base font-semibold text-deep-mocha">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
                <p className="text-xs text-warm-brown text-right -mt-2">
                  *Belum termasuk ongkir & promo.
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/menu"
                className="text-sm font-medium text-deep-mocha hover:text-warm-brown flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Kembali ke Menu
              </Link>
            </div>
          </div>

          <div className="lg:order-2">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  );
}
