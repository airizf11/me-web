// src/app/mudir/purchases/create/page.tsx
import { Metadata } from "next";
import { PurchaseForm } from "@/components/admin/purchase/PurchaseForm";

export const metadata: Metadata = {
  title: "Catat Pembelian Baru - Mudir Menurutmu",
  description:
    "Formulir untuk mencatat pembelian bahan baku atau pengeluaran operasional baru.",
};

export default function CreatePurchasePage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        catat pembelian baru
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <PurchaseForm />
      </div>
    </div>
  );
}
