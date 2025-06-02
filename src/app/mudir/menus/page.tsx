/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/menus/page.tsx
import { Metadata } from "next";
import Link from "next/link"; // Import Link dari next/link
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type MenuItem } from "@/lib/types";
import { MenuTable } from "@/components/admin/menu/MenuTable"; // MenuTable tetap Client Component

export const metadata: Metadata = {
  title: "Manajemen Menu - Mudir Menurutmu",
  description: "Kelola daftar menu minuman Menurutmu.",
};

// Komponen ini akan menjadi Server Component
export default async function MenusManagementPage() {
  const supabase = await createServerSupabaseClient();

  let menuItems: MenuItem[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("menus")
      .select("*")
      .order("order_index", { ascending: true })
      .order("name", { ascending: true });

    if (dbError) {
      throw dbError;
    }
    menuItems = data as MenuItem[];
  } catch (err: any) {
    console.error("Error fetching menu items for admin:", err.message);
    error = "Gagal memuat data menu. Silakan coba lagi nanti.";
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        manajemen menu
      </h1>

      {/* Tombol Tambah Menu Baru yang mengarah ke halaman /mudir/menus/create */}
      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/menus/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Tambah Menu Baru
        </Link>
      </div>

      {/* Bagian Daftar Menu */}
      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          daftar menu
        </h2>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada menu yang ditambahkan.
          </div>
        ) : (
          // MenuTable adalah Client Component, menerima data sebagai prop
          <MenuTable items={menuItems} />
        )}
      </div>
    </div>
  );
}
