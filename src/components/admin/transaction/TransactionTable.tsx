// src/components/admin/transaction/TransactionTable.tsx
"use client";

import Link from "next/link";
import { type Transaction } from "@/lib/types";
import { EyeIcon } from "@heroicons/react/24/outline";

type TransactionTableProps = {
  transactions: Transaction[];
};

export function TransactionTable({ transactions }: TransactionTableProps) {
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

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-brown">
      <table className="min-w-full divide-y divide-warm-brown">
        <thead className="bg-warm-brown text-light-cream">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              ID Transaksi
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
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Pelanggan
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Detail</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-clay-pink/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body truncate max-w-[100px]">
                  {transaction.id.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {formatTimestamp(transaction.transaction_timestamp)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {transaction.platform_source}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-body font-semibold">
                {transaction.total_amount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {transaction.customer_name || "Anonim"}
                </div>
                {transaction.customer_food_delivery_id && (
                  <div className="text-xs text-warm-brown">
                    ID: {transaction.customer_food_delivery_id}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/mudir/transactions/${transaction.id}`}
                  className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                  aria-label="Lihat Detail Transaksi"
                >
                  <EyeIcon className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
