// src/components/marketing/checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";

const WA_BUSINESS_NUMBER = "6283113156507";

export function CheckoutForm() {
  const { items, getTotalPrice } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  const handleFinalCheckout = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Mohon isi nama lengkap dan nomor WhatsApp.");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      toast.error("Mohon isi alamat pengiriman.");
      return;
    }

    let summary = `Halo Menurutmu, saya ingin memesan:\n\n`;
    items.forEach((item) => {
      summary += `• ${item.name} (${item.quantity}x) = ${formatCurrency(
        item.price * item.quantity
      )}\n`;
    });
    summary += `\n*Subtotal: ${formatCurrency(getTotalPrice())}*`;
    summary += `\n\n-------------------\n\n`;
    summary += `*DETAIL PEMESANAN*\n`;
    summary += `Jenis Pesanan: *${
      orderType === "pickup"
        ? "Ambil Sendiri (Self-Pickup)"
        : "Pesan Antar (Delivery)"
    }*\n`;
    summary += `Nama: *${customerName}*\n`;
    summary += `No. WhatsApp: *${customerPhone}*\n`;
    if (orderType === "delivery") {
      summary += `Alamat: *${address}*\n`;
    }
    if (notes) {
      summary += `Catatan: *${notes}*\n`;
    }
    summary += `\nTerima kasih! Saya akan menunggu konfirmasi selanjutnya.`;

    const message = encodeURIComponent(summary);
    window.open(
      `https://wa.me/${WA_BUSINESS_NUMBER}?text=${message}`,
      "_blank"
    );
    toast.success("Pesananmu sedang dialihkan ke WhatsApp!");
  };

  return (
    <div className="bg-white/50 p-6 rounded-xl shadow-sm border border-clay-pink/30">
      <div className="space-y-8">
        <fieldset className="border border-clay-pink/50 rounded-lg p-4 pt-2">
          <legend className="px-2 text-lg font-display lowercase text-deep-mocha">
            Informasi Kontak
          </legend>
          <div className="space-y-4 pt-2">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-warm-brown mb-1"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 rounded-md bg-light-cream border border-clay-pink text-deep-mocha focus:ring-2 focus:ring-deep-mocha"
                placeholder="Nama Kamu"
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-warm-brown mb-1"
              >
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 rounded-md bg-light-cream border border-clay-pink text-deep-mocha focus:ring-2 focus:ring-deep-mocha"
                placeholder="08123..."
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-clay-pink/50 rounded-lg p-4 pt-2">
          <legend className="px-2 text-lg font-display lowercase text-deep-mocha">
            Metode Pemesanan
          </legend>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOrderType("pickup")}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  orderType === "pickup"
                    ? "bg-clay-pink/50 border-deep-mocha scale-105"
                    : "bg-light-cream border-clay-pink hover:border-warm-brown"
                }`}
              >
                <span className="font-semibold text-deep-mocha">
                  Ambil Sendiri
                </span>
                <p className="text-xs text-warm-brown">Self-Pickup</p>
              </button>
              <button
                onClick={() => setOrderType("delivery")}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  orderType === "delivery"
                    ? "bg-clay-pink/50 border-deep-mocha scale-105"
                    : "bg-light-cream border-clay-pink hover:border-warm-brown"
                }`}
              >
                <span className="font-semibold text-deep-mocha">
                  Pesan Antar
                </span>
                <p className="text-xs text-warm-brown">Delivery</p>
              </button>
            </div>
            {orderType === "delivery" && (
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-warm-brown mb-1"
                >
                  Alamat Pengiriman
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-md bg-light-cream border border-clay-pink text-deep-mocha focus:ring-2 focus:ring-deep-mocha"
                  placeholder="Tulis alamat lengkapmu di sini..."
                ></textarea>
                <p className="text-xs text-warm-brown mt-1">
                  Ongkir akan diinfokan lebih lanjut via WhatsApp.
                </p>
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className="border border-clay-pink/50 rounded-lg p-4 pt-2">
          <legend className="px-2 text-lg font-display lowercase text-deep-mocha">
            Catatan Tambahan (Opsional)
          </legend>
          <div className="pt-2">
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-md bg-light-cream border border-clay-pink text-deep-mocha focus:ring-2 focus:ring-deep-mocha"
              placeholder="Contoh: Tanpa gula, es sedikit, dll."
            ></textarea>
          </div>
        </fieldset>

        <div className="mt-6 border-t border-clay-pink/50 pt-6">
          <button
            onClick={handleFinalCheckout}
            className="w-full flex items-center justify-center p-4 rounded-md bg-deep-mocha text-light-cream text-lg font-semibold hover:bg-warm-brown transition-colors shadow-lg"
          >
            <ShoppingBagIcon className="h-6 w-6 mr-3" />
            Konfirmasi & Pesan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
