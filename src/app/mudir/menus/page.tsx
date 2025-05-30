/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/menus/page.tsx
"use client"; // Ubah menjadi Client Component

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Gunakan client browser untuk Client Component
import { type MenuItem } from "@/lib/types";
import { MenuTable } from "@/components/admin/menu/MenuTable";
import { MenuForm } from "@/components/admin/menu/MenuForm"; // Import MenuForm

// Metadata harus diekspor secara terpisah di Client Component jika tidak bisa di Server Component
// Atau biarkan metadata global dari root layout/parent layout saja untuk Client Component.
// Jika ingin metadata spesifik, bisa pakai useMetadata hooks atau passing via props dari Server Component parent.
// Untuk tujuan contoh, kita bisa tinggalkan `export const metadata` jika ini akan menyebabkan error di client component.
// Biasanya, metadata lebih baik di Server Component. Jika Anda ingin metadata dinamis, baru pakai hook.
// Untuk saat ini, kita biarkan saja karena ini adalah Client Component.

export default function MenusManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // State untuk menampilkan/menyembunyikan form
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null); // State untuk item yang sedang diedit
  const supabase = createClient(); // Gunakan client browser

  // Fungsi untuk mengambil data menu dari Supabase
  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("menus")
        .select("*")
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });

      if (dbError) {
        throw dbError;
      }
      setMenuItems(data as MenuItem[]);
    } catch (err: any) {
      console.error("Error fetching menu items for admin:", err.message);
      setError("Gagal memuat data menu. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNewMenu = () => {
    setEditingItem(null); // Pastikan tidak ada item yang diedit
    setShowForm(true); // Tampilkan form
  };

  const handleEditMenu = (item: MenuItem) => {
    setEditingItem(item); // Set item yang akan diedit
    setShowForm(true); // Tampilkan form
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false); // Sembunyikan form setelah sukses
    setEditingItem(null); // Reset item yang diedit
    fetchMenuItems(); // Ambil ulang data menu setelah perubahan
  };

  const handleCancelForm = () => {
    setShowForm(false); // Sembunyikan form
    setEditingItem(null); // Reset item yang diedit
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        manajemen menu
      </h1>

      {/* Tombol Tambah Menu */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddNewMenu}
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Tambah Menu Baru
        </button>
      </div>

      {/* Bagian Daftar Menu */}
      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          daftar menu
        </h2>
        {loading ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Memuat data menu...
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada menu yang ditambahkan.
          </div>
        ) : (
          <MenuTable items={menuItems} onEdit={handleEditMenu} />
        )}
      </div>

      {/* Bagian Form Tambah/Edit Menu (kondisional) */}
      {showForm && (
        <div className="bg-light-cream p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
            {editingItem ? "edit menu" : "tambah menu baru"}
          </h2>
          <MenuForm
            initialData={editingItem}
            onFormSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}
    </div>
  );
}
