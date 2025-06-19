// src/components/marketing/HomepageMenuItemCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { type MenuItem } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { motion } from "framer-motion";

type HomepageMenuItemCardProps = {
  item: MenuItem;
};

export function HomepageMenuItemCard({ item }: HomepageMenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-light-cream text-deep-mocha rounded-xl shadow-lg overflow-hidden 
                 flex flex-col h-full"
    >
      <Link href={`/menu/${item.slug}`} className="block group">
        <div className="relative w-full aspect-square bg-clay-pink overflow-hidden">
          <Image
            src={item.image_url || "/images/menu-placeholder.jpg"}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4 text-center flex-grow flex flex-col">
        <Link href={`/menu/${item.slug}`} className="block">
          <h3 className="text-xl font-display lowercase mb-1 leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-sm font-body text-warm-brown mt-1 h-10 overflow-hidden">
            {item.description}
          </p>
        </Link>
        <p className="text-lg font-body font-semibold text-deep-mocha mt-2">
          {item.price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </p>
        <div className="mt-auto pt-4">
          <AddToCartButton
            item={item}
            className="w-full bg-deep-mocha text-light-cream px-4 py-2 rounded-full font-body hover:bg-warm-brown transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}
