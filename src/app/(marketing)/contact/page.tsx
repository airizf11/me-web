// src/app/(marketing)/contact/page.tsx
import { Metadata } from "next";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontak Kami - Menurutmu",
  description:
    "Informasi kontak Menurutmu: lokasi, email, dan telepon untuk pertanyaan atau kolaborasi.",
};

export default function ContactPage() {
  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream">
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-8 text-center">
        Hubungi Kami
      </h1>

      <div className="max-w-3xl mx-auto space-y-8 text-center">
        <p className="text-lg font-body text-warm-brown mb-8">
          Kami senang mendengar pendapatmu. Jangan ragu untuk menghubungi kami
          melalui informasi di bawah ini:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <MapPinIcon className="h-10 w-10 mb-3 text-clay-pink" />
            <h2 className="text-xl font-display lowercase mb-2">Lokasi Kami</h2>
            <p className="text-sm font-body">
              Jl. Bendul Merisi Selatan V<br />
              Wonokromo, Surabaya, Indonesia
            </p>
            <Link
              href="https://maps.google.com/?q=Jl.+Bendul+Merisi+Selatan+V"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-body underline hover:text-deep-mocha transition-colors"
            >
              Lihat di Peta
            </Link>
          </div>

          <div className="bg-light-cream text-deep-mocha p-6 rounded-lg shadow-md border border-warm-brown flex flex-col items-center justify-center">
            <EnvelopeIcon className="h-10 w-10 mb-3 text-deep-mocha" />
            <h2 className="text-xl font-display lowercase mb-2">Email Kami</h2>
            <p className="text-sm font-body text-warm-brown">
              <Link
                href="mailto:hallo@menurutmu.com"
                className="hover:underline transition-colors"
              >
                hallo@menurutmu.com
              </Link>
            </p>
            <p className="text-xs font-body text-warm-brown mt-2">
              (untuk pertanyaan umum & kolaborasi)
            </p>
          </div>

          <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <PhoneIcon className="h-10 w-10 mb-3 text-clay-pink" />
            <h2 className="text-xl font-display lowercase mb-2">
              Telepon/WhatsApp
            </h2>
            <p className="text-sm font-body">+62 831-1315-6507</p>
            <Link
              href="https://wa.me/6283113156507"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-body underline hover:text-deep-mocha transition-colors"
            >
              Kirim Pesan WhatsApp
            </Link>
          </div>
        </div>

        {/* Placeholder untuk Form Kontak (opsional, jika ingin form langsung di website) */}
        <div className="mt-12 bg-light-cream p-6 rounded-lg shadow-md border border-warm-brown text-left text-deep-mocha">
          <h2 className="text-2xl font-display lowercase mb-4 text-center">
            Kirim Pesan
          </h2>
          <p className="text-center font-body text-warm-brown mb-6">
            Isi formulir di bawah ini dan kami akan segera membalasnya.
          </p>
          {/* Formulir kontak sederhana (placeholder) */}
          <form className="space-y-4 font-body">
            <div>
              <label htmlFor="name" className="block text-sm mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm mb-1">
                Pesanmu
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md hover:bg-warm-brown transition-colors duration-300"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
          <p className="text-center text-xs text-warm-brown mt-6">
            (Catatan: Formulir ini hanyalah placeholder, tidak berfungsi penuh.)
          </p>
        </div>
      </div>
    </section>
  );
}
