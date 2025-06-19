// src/app/mudir/promos/create/page.tsx
import { Metadata } from "next";
import { PromoForm } from "@/components/admin/promo/PromoForm";

export const metadata: Metadata = { title: "Tambah Promo - Mudir Menurutmu" };

export default function CreatePromoPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Tambah Promo Baru
      </h1>
      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <PromoForm />
      </div>
    </div>
  );
}
