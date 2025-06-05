/* eslint-disable react/no-unescaped-entities */
// src/app/(marketing)/blog/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Blog Menurutmu - Refleksi & Cerita",
  description:
    "Ruang untuk perenungan dan cerita-cerita dari Menurutmu. Konten reflektif akan segera hadir.",
};

export default function BlogPage() {
  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream text-center min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <PencilSquareIcon className="h-20 w-20 text-deep-mocha mb-6 animate-pulse" />
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-4">
        ruang refleksi kita
      </h1>
      <p className="text-xl font-body text-warm-brown max-w-3xl mx-auto mb-8">
        "Menurutmu, apa yang sedang kita renungkan hari ini?"
      </p>
      <p className="text-lg font-body text-deep-mocha max-w-3xl mx-auto mb-12">
        Halaman ini adalah tempat di mana kita akan berbagi cerita, pemikiran
        reflektif, dan inspirasi di setiap tegukan. Konten-konten menarik akan
        segera hadir untuk menemani momen-momen kontemplasimu.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-deep-mocha text-light-cream rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
        >
          Kembali ke Beranda
        </Link>
        <a
          href="https://www.instagram.com/me_nurutmu"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-warm-brown text-light-cream rounded-full hover:bg-deep-mocha transition-colors duration-300 font-body text-lg"
        >
          Ikuti Kita di Instagram
        </a>
      </div>
    </section>
  );
}
