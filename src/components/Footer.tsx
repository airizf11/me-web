// src/components/Footer.tsx
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-deep-mocha text-light-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="hover:text-warm-brown transition-colors">
              <h2 className="text-4xl font-display lowercase leading-none">
                menurutmu
              </h2>
            </Link>
            <p className="text-sm font-body text-light-cream/80 max-w-xs">
              Teman berpikirmu di setiap tegukan. Hangat, tenang, dan personal.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-body tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link
                  href="/menu"
                  className="text-light-cream/80 hover:text-light-cream transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-light-cream/80 hover:text-light-cream transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-light-cream/80 hover:text-light-cream transition-colors"
                >
                  Kontak
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-light-cream/80 hover:text-light-cream transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-body tracking-wider">
              Hubungi Kami
            </h3>
            <div className="text-sm font-body text-light-cream/80 space-y-2">
              <p>
                Jl. Bendul Merisi Selatan V,
                <br />
                Wonokromo, Surabaya
              </p>
              <a
                href="mailto:hallo@menurutmu.com"
                className="block hover:text-light-cream transition-colors"
              >
                ainimenurutmu@gmail.com
              </a>
              <a
                href="https://wa.me/6283113156507"
                className="block hover:text-light-cream transition-colors"
              >
                +62 831-1315-6507
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-body tracking-wider">
              Terhubung
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/me_nurutmu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-light-cream/80 hover:text-light-cream hover:scale-110 transition-all"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://wa.me/6283113156507"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-light-cream/80 hover:text-light-cream hover:scale-110 transition-all"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@me_nurutmu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-light-cream/80 hover:text-light-cream hover:scale-110 transition-all"
              >
                <FaTiktok size={24} />
              </a>
            </div>
            {/* <p className="text-xs text-light-cream/70 pt-2">
              Dapatkan cerita dan promo reflektif dari kami.
            </p>
            {/* Placeholder */}
            {/* <form className="flex">
              <input
                type="email"
                placeholder="Email kamu..."
                className="w-full bg-warm-brown/50 text-light-cream placeholder-light-cream/50 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-clay-pink text-sm"
              />
              <button
                type="submit"
                className="bg-clay-pink text-deep-mocha px-4 py-2 rounded-r-md font-semibold text-sm hover:bg-light-cream transition-colors"
              >
                Kirim
              </button>
            </form> */}
          </div>
        </div>

        <div className="border-t border-warm-brown/50 py-6 text-center text-xs text-light-cream/60">
          <p>© {new Date().getFullYear()} Menurutmu. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
