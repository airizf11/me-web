/* eslint-disable react/no-unescaped-entities */
// src/app/(marketing)/checkout/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCartIcon,
  SparklesIcon,
  ShareIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Checkout - menurutmu (Segera Hadir)",
  description:
    "Informasi mengenai fitur pemesanan langsung dari Menurutmu. Sementara, pesan melalui platform favorit Anda.",
};

export default function CheckoutPlaceholderPage() {
  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream text-center min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <SparklesIcon className="h-20 w-20 text-deep-mocha mb-6 animate-pulse" />
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-4">
        Pesananmu sedang dalam perjalanan (segera)!
      </h1>
      <p className="text-xl font-body text-warm-brown max-w-3xl mx-auto mb-8">
        Fitur pemesanan langsung dari website "Menurutmu" sedang dalam tahap
        pengembangan dan akan segera hadir untuk memberikan pengalaman yang
        lebih personal dan reflektif.
      </p>
      <p className="text-lg font-body text-deep-mocha max-w-3xl mx-auto mb-12">
        Sementara itu, Anda masih bisa menikmati minuman "Menurutmu" favorit
        Anda melalui platform di bawah ini:
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-deep-mocha text-light-cream px-6 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg shadow-md"
        >
          <ShoppingCartIcon className="h-6 w-6 mr-2" /> Order via GoFood
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-deep-mocha text-light-cream px-6 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg shadow-md"
        >
          <ShoppingCartIcon className="h-6 w-6 mr-2" /> Order via GrabFood
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-deep-mocha text-light-cream px-6 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg shadow-md"
        >
          <ShoppingCartIcon className="h-6 w-6 mr-2" /> Order via ShopeeFood
        </a>
        <a
          href="https://wa.me/6283113156507"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-warm-brown text-light-cream px-6 py-3 rounded-full hover:bg-deep-mocha transition-colors duration-300 font-body text-lg shadow-md"
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6 mr-2" /> Pesan via
          WhatsApp
        </a>
        <a
          href="https://www.instagram.com/me_nurutmu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-clay-pink text-deep-mocha px-6 py-3 rounded-full hover:bg-warm-brown hover:text-light-cream transition-colors duration-300 font-body text-lg shadow-md"
        >
          <ShareIcon className="h-6 w-6 mr-2" /> DM via Instagram
        </a>
      </div>

      <Link
        href="/"
        className="text-deep-mocha hover:text-warm-brown transition-colors font-body text-md flex items-center"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Kembali ke Beranda
      </Link>
    </section>
  );
}
