/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Footer.tsx
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export function Footer() {
  return (
    <footer className="bg-deep-mocha text-light-cream py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-8 md:mb-0 md:w-1/3">
          <Link href="/" className="hover:text-warm-brown transition-colors">
            <h2 className="text-4xl font-display lowercase leading-none mb-2">
              menurutmu
            </h2>
          </Link>
          <p className="text-sm font-body max-w-xs mx-auto md:mx-0">
            Teman berpikirmu di setiap tegukan.
          </p>
        </div>

        <div className="mb-8 md:mb-0 md:w-1/3">
          <h3 className="text-lg font-semibold font-body mb-4">Navigasi</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="hover:text-warm-brown transition-colors text-base font-body"
              >
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-warm-brown transition-colors text-base font-body"
              >
                Kontak
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-warm-brown transition-colors text-base font-body"
              >
                Refleksi
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:w-1/3 flex flex-col items-center md:items-end">
          <h3 className="text-xl font-display lowercase mb-4">
            terhubung dengan kami
          </h3>
          <div className="flex space-x-6 mb-4">
            <a
              href="https://www.instagram.com/me_nurutmu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-cream hover:text-clay-pink transition-colors"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a
              href="https://wa.me/6283113156507"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-cream hover:text-clay-pink transition-colors"
              aria-label="WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </a>
            <a
              href="https://www.tiktok.com/@menurutmu_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-cream hover:text-clay-pink transition-colors"
              aria-label="TikTok"
            >
              <FontAwesomeIcon icon={faTiktok} size="lg" />
            </a>
          </div>
          <p className="text-sm font-body">
            © {new Date().getFullYear()} Menurutmu. All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
