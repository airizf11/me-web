// src/components/marketing/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type HeroSectionProps = {
  imageUrl: string;
  altText: string;
  headline: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  brandName: string;
};

export function HeroSection({
  imageUrl,
  altText,
  headline,
  bodyText,
  ctaText,
  ctaLink,
  brandName,
}: HeroSectionProps) {
  const finalImageUrl = imageUrl || "/images/hero-default.jpg";
  const finalAltText =
    altText || "Background gambar hero untuk brand Menurutmu";

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src={finalImageUrl}
        alt={finalAltText}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
        className="brightness-[0.8]"
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundColor: "rgba(109, 76, 65, 0.3)",
          color: "#EFE9E4",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-display lowercase leading-none mb-4 drop-shadow-lg">
            {brandName}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-3xl md:text-5xl font-display lowercase text-clay-pink mb-6 drop-shadow"
          >
            {headline}
          </motion.p>
          {bodyText && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="text-lg md:text-xl font-body max-w-2xl mx-auto mb-8 drop-shadow"
            >
              {bodyText}
            </motion.p>
          )}
          {ctaText && ctaLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center bg-clay-pink text-deep-mocha px-8 py-4 rounded-full font-body text-xl hover:bg-warm-brown hover:text-light-cream transition-colors duration-300 shadow-lg"
              >
                {ctaText} <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
