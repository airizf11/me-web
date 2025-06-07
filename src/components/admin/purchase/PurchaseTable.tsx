// src/components/admin/purchase/PurchaseTable.tsx
"use client";

import Link from "next/link";
import { type Transaction } from "@/lib/types";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"; // Ikon
import toast from "react-hot-toast";
import { deletePurchaseTransaction } from "@/lib/actions/transactions/purchases"; // Import Server Action

type PurchaseTableProps = {
  purchases: Transaction[];
};

export function PurchaseTable({ purchases }: PurchaseTableProps) {
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (purchase: Transaction) => {
    if (
      confirm(
        `Yakin ingin menghapus catatan pembelian "${purchase.id.substring(
          0,
          8
        )}..."? Aksi ini tidak dapat dibatalkan.`
      )
    ) {
      toast.loading("Menghapus catatan pembelian...");
      const result = await deletePurchaseTransaction(purchase.id);
      toast.dismiss();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menghapus catatan pembelian.");
      }
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-brown">
      <table className="min-w-full divide-y divide-warm-brown">
        <thead className="bg-warm-brown text-light-cream">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              ID Pembelian
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Waktu
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Sumber
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Total
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="hover:bg-clay-pink/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body truncate max-w-[100px]">
                  {purchase.id.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {formatTimestamp(purchase.transaction_timestamp)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {purchase.platform_source}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-body font-semibold">
                {purchase.total_amount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2 justify-end">
                  <Link
                    href={`/mudir/purchases/${purchase.id}`}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Lihat Detail Pembelian"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  {/* Tombol Edit (placeholder) */}
                  <button
                    type="button"
                    onClick={() =>
                      toast("Fitur edit pembelian belum diimplementasikan.")
                    }
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Edit Pembelian"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(purchase)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="Hapus Pembelian"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
