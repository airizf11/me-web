// src/components/marketing/MenuItemCardPublic.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { type MenuItem } from "@/lib/types";
import { motion } from "framer-motion";
import { AddToCartButton } from "./AddToCartButton";

type MenuItemCardPublicProps = {
  item: MenuItem;
};

export function MenuItemCardPublic({ item }: MenuItemCardPublicProps) {
  const imageUrl = item.image_url || "/images/menu-placeholder.jpg";
  const altText = item.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-light-cream text-deep-mocha rounded-xl shadow-lg overflow-hidden 
                 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl cursor-pointer"
    >
      <Link href={`/menu/${item.slug}`} className="block">
        <div className="relative w-full aspect-square bg-clay-pink overflow-hidden">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-xl font-display lowercase mb-1 leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-lg font-body font-semibold text-deep-mocha mt-2">
            {item.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
          <p className="text-sm font-body text-warm-brown mt-1 truncate">
            {item.description}
          </p>
          <div className="mt-4">
            <AddToCartButton item={item} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
