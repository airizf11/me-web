// src/app/mudir/menus/create/page.tsx
import { Metadata } from "next";
import { MenuForm } from "@/components/admin/menu/MenuForm"; // Import MenuForm

export const metadata: Metadata = {
  title: "Tambah Menu Baru - Mudir Menurutmu",
  description: "Formulir untuk menambahkan item menu baru ke Menurutmu.",
};

export default function CreateMenuPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        tambah menu baru
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <MenuForm /> {/* Render MenuForm tanpa initialData */}
      </div>
    </div>
  );
}
