/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(marketing)/menu/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClientReadOnly } from "@/lib/supabase/server";
import { type MenuItem } from "@/lib/types";
import { MenuCategorySection } from "@/components/marketing/MenuCategorySection";

export const metadata: Metadata = {
  title: "Menu Menurutmu - Temukan Pilihanmu",
  description:
    "Daftar menu kopi dan minuman reflektif dari Menurutmu, dikelompokkan berdasarkan kategori.",
};

export default async function MenuPage() {
  const supabase = await createServerSupabaseClientReadOnly();

  let menuItems: MenuItem[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("order_index", { ascending: true })
      .order("name", { ascending: true });

    if (dbError) {
      throw dbError;
    }
    menuItems = data as MenuItem[];
  } catch (err: any) {
    console.error("Error fetching menu items for public page:", err.message);
    error = "Gagal memuat daftar menu. Silakan coba lagi nanti.";
  }

  const categorizedMenus: { [category: string]: MenuItem[] } = {};
  menuItems.forEach((item) => {
    const categoryName = item.category || "Lain-lain";
    if (!categorizedMenus[categoryName]) {
      categorizedMenus[categoryName] = [];
    }
    categorizedMenus[categoryName].push(item);
  });

  const sortedCategories = Object.keys(categorizedMenus).sort();

  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream">
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-8 text-center">
        Menu Menurutmu
      </h1>
      <p className="text-lg font-body text-warm-brown text-center mb-12 max-w-2xl mx-auto">
        Setiap tegukan adalah ajakan untuk merenung. Jelajahi pilihan minuman
        kami yang diracik khusus untuk menemani setiap momen refleksi Anda.
      </p>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center p-8 text-warm-brown font-body">
          Belum ada menu yang tersedia. Silakan cek lagi nanti.
        </div>
      ) : (
        <div className="space-y-16">
          {" "}
          {sortedCategories.map((category) => (
            <MenuCategorySection
              key={category}
              categoryName={category}
              menus={categorizedMenus[category]}
            />
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-display text-deep-mocha mb-6 lowercase">
          Siap Memesan?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via WhatsApp
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GoFood
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GrabFood
          </a>
          <a
            href="#"
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
