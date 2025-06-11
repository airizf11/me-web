// src/app/mudir/raw-materials/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type RawMaterial } from "@/lib/types";
import { RawMaterialTable } from "@/components/admin/raw-material/RawMaterialTable";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Manajemen Bahan Baku - Mudir Menurutmu",
  description: "Kelola daftar bahan baku untuk produksi minuman Menurutmu.",
};

export default async function RawMaterialsManagementPage() {
  const supabase = await createServerSupabaseClient();

  let rawMaterials: RawMaterial[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("raw_materials")
      .select("*")
      .order("name", { ascending: true });

    if (dbError) {
      throw dbError;
    }
    rawMaterials = data as RawMaterial[];
  } catch (err: any) {
    console.error("Error fetching raw materials for admin:", err.message);
    error = "Gagal memuat daftar bahan baku. Silakan coba lagi nanti.";
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Manajemen Bahan Baku
      </h1>

      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase mb-4">Ringkasan Stok</h2>
        <div className="flex justify-between items-center">
          <span className="text-lg font-body">Total Bahan Baku:</span>
          <span className="text-3xl font-bold font-body">
            {rawMaterials.length}
          </span>
        </div>
        {/* Bisa tambah total nilai stok or alert stok rendah */}
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/raw-materials/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Tambah Bahan Baku Baru
        </Link>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Daftar Bahan Baku
        </h2>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
            {error}
          </div>
        ) : rawMaterials.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body mt-4">
            Belum ada bahan baku yang dicatat.
          </div>
        ) : (
          <RawMaterialTable rawMaterials={rawMaterials} />
        )}
      </div>
    </div>
  );
}
