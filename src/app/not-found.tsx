/* eslint-disable react/no-unescaped-entities */
// src/app/not-found.tsx
import Link from "next/link";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-light-cream text-deep-mocha p-8 text-center">
      <CubeTransparentIcon className="h-24 w-24 text-warm-brown mb-6 animate-pulse" />
      <h1 className="text-5xl md:text-7xl font-display lowercase leading-none mb-4">
        Halaman tidak ditemukan
      </h1>
      <p className="text-lg md:text-xl font-body text-warm-brown max-w-xl mb-8">
        "Menurutmu, ke mana halaman ini pergi? Sepertinya ia sedang dalam
        perenungan mendalam dan belum kembali."
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-deep-mocha text-light-cream rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
