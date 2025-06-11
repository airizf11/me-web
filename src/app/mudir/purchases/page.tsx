/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/purchases/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction } from "@/lib/types";
import { PurchaseTable } from "@/components/admin/purchase/PurchaseTable";
import { Suspense } from "react";
import { TransactionFilter } from "@/components/admin/transaction/TransactionFilter";

interface SegmentSearchParams {
  period?: "daily" | "weekly" | "monthly" | "all";
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface PurchasesManagementPageProps {
  searchParams?: Promise<SegmentSearchParams>;
}

export const metadata: Metadata = {
  title: "Manajemen Pembelian - Mudir Menurutmu",
  description:
    "Kelola dan tinjau catatan pembelian bahan baku dan pengeluaran operasional.",
};

export default async function PurchasesManagementPage({
  searchParams,
}: PurchasesManagementPageProps) {
  const supabase = await createServerSupabaseClient();
  let purchases: Transaction[] = [];
  let error: string | null = null;

  const resolvedSearchParams = (await searchParams) || {};

  try {
    const filters = {
      period: resolvedSearchParams.period,
      platformSource: resolvedSearchParams.platform,
      search: resolvedSearchParams.search,
      startDate: resolvedSearchParams.startDate,
      endDate: resolvedSearchParams.endDate,
      type: "purchase" as const,
    };

    const { data, error: fetchError } = await (
      await import("@/lib/actions/transactions/read")
    ).getTransactions(filters);

    if (fetchError) {
      throw new Error(fetchError);
    }
    purchases = data;
  } catch (err: any) {
    console.error("Error fetching purchases for admin:", err.message);
    error = "Gagal memuat daftar pembelian. Silakan coba lagi nanti.";
  }

  const totalPurchaseAmount = purchases.reduce(
    (sum, t) => sum + t.total_amount,
    0
  );

  const purchaseSources = [
    "All",
    "Shopee",
    "Alfamart",
    "Perorangan",
    "Toko",
    "Lain-lain",
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Manajemen Pembelian
      </h1>

      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase mb-4">
          Ringkasan Pengeluaran
        </h2>
        <div className="flex justify-between items-center">
          <span className="text-lg font-body">Total Pengeluaran:</span>
          <span className="text-3xl font-bold font-body">
            {totalPurchaseAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/purchases/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Catat Pembelian Baru
        </Link>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Daftar Pembelian
        </h2>

        <Suspense
          fallback={
            <div className="text-center text-warm-brown">Memuat filter...</div>
          }
        >
          <TransactionFilter
            platformSources={purchaseSources}
            currentFilters={resolvedSearchParams}
          />
        </Suspense>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
            {error}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body mt-4">
            Belum ada pembelian yang dicatat atau tidak ada yang sesuai filter.
          </div>
        ) : (
          <PurchaseTable purchases={purchases} />
        )}
      </div>
    </div>
  );
}
