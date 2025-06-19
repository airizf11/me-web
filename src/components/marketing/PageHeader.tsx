// src/components/marketing/PageHeader.tsx
"use client";

import { motion } from "framer-motion";

type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-warm-brown/80 rounded-xl shadow-lg text-center p-8 md:p-12 mb-12 text-light-cream overflow-hidden relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-display lowercase drop-shadow-md">
          {title}
        </h1>
        <p className="mt-4 text-lg md:text-xl font-body max-w-2xl mx-auto drop-shadow">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}
