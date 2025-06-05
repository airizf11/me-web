/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/transactions/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction } from "@/lib/types";
import { TransactionTable } from "@/components/admin/transaction/TransactionTable";
import { Suspense } from "react";
import { TransactionFilter } from "@/components/admin/transaction/TransactionFilter"; // Import TransactionFilter yang terpisah

// Definisikan tipe untuk searchParams agar sesuai dengan PageProps
interface SegmentSearchParams {
  period?: "daily" | "weekly" | "monthly" | "all";
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Perbarui tipe props halaman untuk sesuai dengan PageProps
interface TransactionsManagementPageProps {
  searchParams?: Promise<SegmentSearchParams>; // searchParams bisa berupa Promise
}

export const metadata: Metadata = {
  title: "Manajemen Transaksi - Mudir Menurutmu",
  description: "Kelola dan tinjau catatan penjualan minuman Menurutmu.",
};

// Komponen ini adalah Server Component
export default async function TransactionsManagementPage({
  searchParams,
}: TransactionsManagementPageProps) {
  // Gunakan tipe props yang diperbarui
  const supabase = await createServerSupabaseClient();
  let transactions: Transaction[] = [];
  let error: string | null = null;

  // PENTING: AWAIT searchParams sebelum mengakses propertinya
  const resolvedSearchParams = (await searchParams) || {};

  try {
    const filters = {
      period: resolvedSearchParams.period,
      platformSource: resolvedSearchParams.platform,
      search: resolvedSearchParams.search,
      startDate: resolvedSearchParams.startDate,
      endDate: resolvedSearchParams.endDate,
    };

    const { data, error: fetchError } = await (
      await import("@/lib/actions/transactions/read")
    ).getTransactions(filters);

    if (fetchError) {
      throw new Error(fetchError);
    }
    transactions = data;
  } catch (err: any) {
    console.error("Error fetching transactions for admin:", err.message);
    error = "Gagal memuat daftar transaksi. Silakan coba lagi nanti.";
  }

  const totalSalesAmount = transactions.reduce(
    (sum, t) => sum + t.total_amount,
    0
  );

  const platformSources = [
    "All",
    "GoFood",
    "GrabFood",
    "ShopeeFood",
    "WhatsApp",
    "Instagram",
    "Direct-Internal",
    "Walk-in",
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        manajemen transaksi
      </h1>

      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase mb-4">
          ringkasan penjualan
        </h2>
        <div className="flex justify-between items-center">
          <span className="text-lg font-body">Total Penjualan:</span>
          <span className="text-3xl font-bold font-body">
            {totalSalesAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/transactions/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Catat Transaksi Baru
        </Link>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          daftar transaksi
        </h2>

        {/* Filter Section (Client Component yang di-wrap Suspense) */}
        <Suspense
          fallback={
            <div className="text-center text-warm-brown">Memuat filter...</div>
          }
        >
          <TransactionFilter
            platformSources={platformSources}
            currentFilters={resolvedSearchParams}
          />
        </Suspense>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body mt-4">
            Belum ada transaksi yang dicatat atau tidak ada yang sesuai filter.
          </div>
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    </div>
  );
}
