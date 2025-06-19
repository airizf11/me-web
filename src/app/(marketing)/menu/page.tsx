// src/app/(marketing)/menu/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type MenuItem } from "@/lib/types";
import { MenuCategorySection } from "@/components/marketing/MenuCategorySection";
import { PageHeader } from "@/components/marketing/PageHeader";

export const metadata: Metadata = {
  title: "Menu Menurutmu - Temukan Pilihanmu",
  description:
    "Jelajahi daftar lengkap menu kopi, non-kopi, dan hidangan reflektif dari Menurutmu. Setiap tegukan adalah ajakan untuk merenung.",
  openGraph: {
    title: "Menu Lengkap Menurutmu",
    description:
      "Temukan minuman favoritmu untuk menemani setiap momen perenungan.",
    url: "https://menurutmu.vercel.app/menu",
  },
};

const CATEGORY_ORDER = [
  "Menu Kopi",
  "Menu Cokelat",
  "Menu Segar",
  // Tambah kategori lain
];

async function getMenuData() {
  const supabase = await createServerSupabaseClient();
  let menuItems: MenuItem[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("order_index", { ascending: true })
      .order("name", { ascending: true });

    if (dbError) throw dbError;
    menuItems = data as MenuItem[];
  } catch (err: any) {
    console.error("Error fetching menu items for public page:", err.message);
    error = "Gagal memuat daftar menu. Silakan coba lagi nanti.";
  }
  return { menuItems, error };
}

export default async function MenuPage() {
  const { menuItems, error } = await getMenuData();

  const categorizedMenus: { [category: string]: MenuItem[] } = {};
  menuItems.forEach((item) => {
    const categoryName = item.category || "Lain-lain";
    if (!categorizedMenus[categoryName]) {
      categorizedMenus[categoryName] = [];
    }
    categorizedMenus[categoryName].push(item);
  });

  const sortedCategories = Object.keys(categorizedMenus).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const itemListElement = menuItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: item.name,
      image: item.image_url,
      description: item.description,
      url: `https://menurutmu.vercel.app/menu/${item.slug}`,
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: item.price,
      },
    },
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Menu Menurutmu",
    description: "Daftar lengkap menu minuman dan makanan dari Menurutmu.",
    itemListElement: itemListElement,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bg-light-cream">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <PageHeader
            title="Menu Menurutmu"
            subtitle="Setiap tegukan adalah ajakan untuk merenung. Jelajahi pilihan minuman kami yang diracik khusus untuk menemani setiap momen refleksi Anda."
          />

          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center p-8 text-warm-brown font-body">
              Belum ada menu yang tersedia. Silakan cek lagi nanti.
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16">
              {sortedCategories.map((category) => (
                <MenuCategorySection
                  key={category}
                  categoryName={category}
                  menus={categorizedMenus[category]}
                />
              ))}
            </div>
          )}

          <div className="mt-16 text-center border-t border-clay-pink/50 pt-10">
            <h2 className="text-2xl font-display text-deep-mocha mb-6 lowercase">
              Siap Memesan?
            </h2>
            <p className="text-warm-brown mb-6 font-body">
              Tambahkan item ke keranjang dan lanjutkan ke halaman checkout,
              atau hubungi kami via:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/6283113156507"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/me_nurutmu"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
              >
                Instagram
              </a>
              {/* Tambah link food deliv lain if sudah ada */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
