/* eslint-disable react/no-unescaped-entities */
// src/app/(marketing)/page.tsx
import { Metadata } from "next";
import { Carousel } from "@/components/Carousel";

export const metadata: Metadata = {
  title: "Menurutmu - Refleksi di Setiap Tegukan",
  description:
    "Brand minuman reflektif yang mengajak konsumen berpikir dan berdialog.",
};

export default function HomePage() {
  return (
    <section className="container mx-auto p-8 text-center py-20 bg-light-cream">
      <h1 className="text-5xl font-display text-deep-mocha mb-4 lowercase">
        menurutmu
      </h1>
      <p className="text-xl font-body text-warm-brown max-w-2xl mx-auto mb-8">
        Refleksi di Setiap Tegukan.
        <br />
        Teman pikiranmu, satu cup, satu makna.
      </p>

      <div className="mb-12">
        <Carousel />
      </div>

      <div className="max-w-3xl mx-auto my-12 p-6 bg-warm-brown text-light-cream rounded-lg shadow-md">
        <h2 className="text-3xl font-display mb-4 lowercase">
          tentang menurutmu
        </h2>
        <p className="text-lg font-body leading-relaxed">
          Kami adalah teman berpikir di tengah rutinitas cepat. "Menurutmu"
          menyajikan kopi dan minuman lain yang enak, ringan, dan relatable,
          sambil mengajakmu berdialog dan merenung. Hangat, tenang, dan
          personal.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-display text-deep-mocha mb-6 lowercase">
          pesan menurutmu sekarang
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#" // Ganti dengan link WhatsApp Bisnis Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via WhatsApp
          </a>
          <a
            href="#" // Ganti dengan link GoFood Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GoFood
          </a>
          <a
            href="#" // Ganti dengan link GrabFood Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GrabFood
          </a>
          <a
            href="#" // Ganti dengan link ShopeeFood Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via ShopeeFood
          </a>
        </div>
      </div>
    </section>
  );
}
