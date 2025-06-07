// src/app/mudir/raw-materials/create/page.tsx
import { Metadata } from "next";
import { RawMaterialForm } from "@/components/admin/raw-material/RawMaterialForm";

export const metadata: Metadata = {
  title: "Tambah Bahan Baku Baru - Mudir Menurutmu",
  description: "Formulir untuk menambahkan bahan baku baru ke inventaris.",
};

export default function CreateRawMaterialPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        tambah bahan baku baru
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <RawMaterialForm />
      </div>
    </div>
  );
}
