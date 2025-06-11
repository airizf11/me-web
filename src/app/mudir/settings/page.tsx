/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// src/app/mudir/settings/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Pengaturan Sistem - Mudir Menurutmu",
  description: "Konfigurasi umum aplikasi dan integrasi.",
};

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Pengaturan Sistem
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-light-cream p-6 rounded-lg shadow-md border border-warm-brown">
          <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4 flex items-center">
            <WrenchScrewdriverIcon className="h-6 w-6 mr-2" /> Umum
          </h2>
          <p className="font-body text-warm-brown mb-4">
            Kelola pengaturan dasar aplikasi seperti informasi brand, jam
            operasional, atau pesan default.
          </p>
          <div className="text-right">
            <button className="px-4 py-2 bg-deep-mocha text-light-cream rounded-md hover:bg-warm-brown transition-colors">
              Edit Pengaturan Umum
            </button>
          </div>
        </div>

        <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-display lowercase mb-4 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-clay-pink" /> Integrasi
          </h2>
          <p className="font-body text-light-cream/90 mb-4">
            Hubungkan "Menurutmu" dengan layanan pihak ketiga seperti platform
            pengiriman makanan, payment gateway, atau layanan email.
          </p>
          <ul className="list-disc list-inside space-y-2 text-light-cream/70 font-body">
            <li>Integrasi GoFood/GrabFood/ShopeeFood</li>
            <li>Pengaturan API Payment Gateway (Midtrans/Xendit)</li>
            <li>Konfigurasi Email Notifikasi</li>
          </ul>
          <div className="text-right mt-4">
            <button className="px-4 py-2 bg-clay-pink text-deep-mocha rounded-md hover:bg-light-cream hover:text-deep-mocha transition-colors">
              Kelola Integrasi
            </button>
          </div>
        </div>

        <div className="bg-light-cream p-6 rounded-lg shadow-md border border-warm-brown">
          <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4 flex items-center">
            <Cog6ToothIcon className="h-6 w-6 mr-2" /> Lanjutan
          </h2>
          <p className="font-body text-warm-brown mb-4">
            Akses pengaturan teknis atau sensitif lainnya yang mungkin jarang
            diubah.
          </p>
          <div className="text-right">
            <button className="px-4 py-2 bg-deep-mocha text-light-cream rounded-md hover:bg-warm-brown transition-colors">
              Akses Pengaturan Lanjutan
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-8 text-warm-brown font-body">
        <WrenchScrewdriverIcon className="h-6 w-6 mr-2" />
        <span>Halaman pengaturan sistem sedang dalam tahap penyelesaian.</span>
      </div>
    </div>
  );
}
