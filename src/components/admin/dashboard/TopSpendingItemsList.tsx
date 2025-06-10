// src/components/admin/dashboard/TopSpendingItemsList.tsx
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline"; // Ikon

// Tipe untuk item pengeluaran teratas (sesuai output dari getTopSpendingItems)
interface TopSpendingItem {
  name: string;
  totalQuantity: number;
  totalCost: number;
}

type TopSpendingItemsListProps = {
  items: TopSpendingItem[];
  error?: string | null;
};

export function TopSpendingItemsList({
  items,
  error,
}: TopSpendingItemsListProps) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-warm-brown py-4 font-body">
        Belum ada data pengeluaran untuk periode ini.
      </div>
    );
  }

  return (
    <div className="divide-y divide-clay-pink text-deep-mocha">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center py-3 px-2 hover:bg-clay-pink/30 transition-colors rounded-md"
        >
          {/* Nama Item */}
          <div className="flex-grow">
            <p className="font-body text-sm font-semibold truncate">
              {item.name}
            </p>
            <p className="text-xs text-warm-brown mt-0.5">
              Jumlah: {item.totalQuantity.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Total Biaya */}
          <span className="text-sm font-bold ml-4">
            {item.totalCost.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      ))}
      <div className="pt-4 text-right">
        <Link
          href="/mudir/purchases"
          className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
        >
          Lihat Semua Pembelian <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
