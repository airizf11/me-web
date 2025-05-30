/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(marketing)/menu/page.tsx
"use client"; // Wajib karena ada fetching data dan state

// import { Metadata } from "next"; // Metadata masih bisa diimport di Client Component
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type MenuItem } from "@/lib/types"; // Import tipe MenuItem
import { MenuItemCard } from "@/components/MenuItemCard"; // Import komponen MenuItemCard

{
  /* export const metadata: Metadata = {
  title: "Menu Menurutmu - Temukan Pilihanmu",
  description: "Daftar menu kopi dan minuman reflektif dari Menurutmu.",
}; */
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const { data, error } = await supabase
          .from("menus")
          .select("*")
          .eq("is_available", true) // Hanya tampilkan menu yang tersedia
          .order("order_index", { ascending: true }) // Urutkan berdasarkan order_index
          .order("name", { ascending: true }); // Kemudian berdasarkan nama

        if (error) {
          throw error;
        }

        // Jika tidak ada data, gunakan dummy data sementara
        if (!data || data.length === 0) {
          setMenuItems([
            {
              id: "dummy-1",
              name: "Kopi Vanilla",
              slug: "kopi-vanilla",
              description: "Kopi, susu, vanilla",
              price: 25000,
              image_url: null,
              category: "Coffee",
              is_available: true,
              order_index: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "dummy-2",
              name: "Kopi Gula Aren",
              slug: "kopi-gula-aren",
              description: "Kopi, susu, gula aren",
              price: 23000,
              image_url: null,
              category: "Coffee",
              is_available: true,
              order_index: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "dummy-3",
              name: "Kopi Gula Biasa",
              slug: "kopi-gula-biasa",
              description: "Kopi, susu, gula pasir",
              price: 22000,
              image_url: null,
              category: "Coffee",
              is_available: true,
              order_index: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "dummy-4",
              name: "Kopi Hitam Gula",
              slug: "kopi-hitam-gula",
              description: "Kopi, air, gula",
              price: 18000,
              image_url: null,
              category: "Coffee",
              is_available: true,
              order_index: 3,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "dummy-5",
              name: "Kopi Hitam",
              slug: "kopi-hitam",
              description: "Kopi dan air",
              price: 17000,
              image_url: null,
              category: "Coffee",
              is_available: true,
              order_index: 4,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ] as MenuItem[]);
        } else {
          setMenuItems(data as MenuItem[]);
        }
      } catch (err: any) {
        console.error("Error fetching menu items:", err.message);
        setError("Gagal memuat daftar menu. Silakan coba lagi nanti.");
        // Fallback ke dummy data jika ada error
        setMenuItems([
          {
            id: "error-dummy",
            name: "Menu Tidak Tersedia",
            slug: "error",
            description: "Terjadi kesalahan saat memuat menu.",
            price: 0,
            image_url: null,
            category: "Info",
            is_available: false,
            order_index: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ] as MenuItem[]);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto p-8 py-20 bg-light-cream text-center font-body text-deep-mocha">
        Memuat daftar menu...
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto p-8 py-20 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg">
        {error}
      </section>
    );
  }

  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream">
      <h1 className="text-4xl font-display text-deep-mocha mb-8 text-center lowercase">
        menu menurutmu
      </h1>
      <p className="text-lg font-body text-warm-brown text-center mb-12 max-w-2xl mx-auto">
        Setiap tegukan adalah ajakan untuk merenung. Pilih minuman yang sesuai
        dengan suasana hatimu hari ini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* CTA Order di bagian bawah menu */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-display text-deep-mocha mb-6 lowercase">
          siap memesan?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#" // Ganti dengan link WhatsApp Bisnis Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via WhatsApp
          </a>
          <a
            href="#" // Ganti dengan link GoFood Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GoFood
          </a>
          <a
            href="#" // Ganti dengan link GrabFood Anda
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep-mocha text-light-cream px-8 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Order via GrabFood
          </a>
          <a
            href="#" // Ganti dengan link ShopeeFood Anda
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
