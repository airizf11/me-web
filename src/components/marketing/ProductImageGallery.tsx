// src/components/marketing/ProductImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type ProductImageGalleryProps = {
  mainImage: string;
  additionalImages?: string[] | null;
  altText: string;
};

export function ProductImageGallery({
  mainImage,
  additionalImages,
  altText,
}: ProductImageGalleryProps) {
  const allImages = [mainImage, ...(additionalImages || [])];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-clay-pink/50 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={allImages[activeIndex]}
              alt={`${altText} - gambar ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                activeIndex === index
                  ? "border-deep-mocha"
                  : "border-transparent hover:border-warm-brown"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className="opacity-80 group-hover:opacity-100"
              />
              {activeIndex === index && (
                <div className="absolute inset-0 bg-white/30"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
