// src/components/marketing/MenuCategorySection.tsx
"use client";

import React from "react";
import { type MenuItem } from "@/lib/types";
// import { MenuItemCardPublic } from "./MenuItemCardPublic";
import { HomepageMenuItemCard } from "./HomepageMenuItemCard";

type MenuCategorySectionProps = {
  categoryName: string;
  menus: MenuItem[];
};

export function MenuCategorySection({
  categoryName,
  menus,
}: MenuCategorySectionProps) {
  const sectionBgClass = categoryName.includes("Menu Kopi")
    ? "bg-warm-brown text-light-cream"
    : "bg-light-cream text-deep-mocha";
  const headerTextColorClass = categoryName.includes("Menu Kopi")
    ? "text-light-cream"
    : "text-deep-mocha";
  const dividerColor = categoryName.includes("Menu Kopi")
    ? "border-light-cream"
    : "border-warm-brown";

  return (
    <section className={`p-8 rounded-lg shadow-xl ${sectionBgClass}`}>
      <h2
        className={`text-3xl font-display lowercase mb-6 border-b pb-4 ${headerTextColorClass} ${dividerColor}`}
      >
        {categoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menus.map((menu) => (
          <HomepageMenuItemCard key={menu.id} item={menu} />
        ))}
      </div>
    </section>
  );
}
