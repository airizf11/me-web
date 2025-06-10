// src/components/admin/dashboard/RecentTransactionsList.tsx
import Link from "next/link";
import { type Transaction } from "@/lib/types";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

type RecentTransactionsListProps = {
  transactions: Transaction[];
  error?: string | null;
};

export function RecentTransactionsList({
  transactions,
  error,
}: RecentTransactionsListProps) {
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-warm-brown py-4 font-body">
        Belum ada transaksi penjualan terbaru.
      </div>
    );
  }

  return (
    <div className="divide-y divide-clay-pink text-deep-mocha">
      {transactions.map((t) => (
        <Link
          href={`/mudir/transactions/${t.id}`}
          key={t.id}
          className="block py-3 px-2 hover:bg-clay-pink/30 transition-colors rounded-md"
        >
          <div className="flex justify-between items-center text-sm font-body">
            <span className="font-semibold truncate max-w-[60%]">
              {t.customer_name || t.platform_source}
            </span>
            <span className="text-warm-brown text-xs">
              {formatTimestamp(t.transaction_timestamp)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-warm-brown">{t.platform_source}</span>
            <span className="font-bold text-base">
              {t.total_amount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
        </Link>
      ))}
      <div className="pt-4 text-right">
        <Link
          href="/mudir/transactions"
          className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
        >
          Lihat Semua <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
