// src/app/mudir/transactions/create/page.tsx
import { Metadata } from "next";
import { TransactionForm } from "@/components/admin/transaction/TransactionForm";

export const metadata: Metadata = {
  title: "Catat Transaksi Baru - Mudir Menurutmu",
  description: "Formulir untuk mencatat transaksi penjualan minuman baru.",
};

export default function CreateTransactionPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Catat Transaksi Baru
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <TransactionForm />
      </div>
    </div>
  );
}
