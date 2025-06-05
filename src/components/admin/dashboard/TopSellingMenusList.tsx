// src/components/admin/dashboard/TopSellingMenusList.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline"; // Ikon

// Tipe untuk item menu terlaris (sesuai output dari getTopSellingMenus)
interface TopMenuItem {
  name: string;
  imageUrl: string | null;
  totalQuantity: number;
  totalRevenue: number;
}

type TopSellingMenusListProps = {
  menus: TopMenuItem[];
  error?: string | null;
};

export function TopSellingMenusList({
  menus,
  error,
}: TopSellingMenusListProps) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center text-warm-brown py-4 font-body">
        Belum ada data penjualan menu untuk periode ini.
      </div>
    );
  }

  return (
    <div className="divide-y divide-clay-pink text-deep-mocha">
      {menus.map((menu, index) => (
        <div
          key={index}
          className="flex items-center py-3 px-2 hover:bg-clay-pink/30 transition-colors rounded-md"
        >
          {/* Nomor Urut */}
          <span className="text-lg font-bold mr-3 text-deep-mocha">
            {index + 1}.
          </span>

          {/* Gambar Menu */}
          {menu.imageUrl && (
            <div className="w-12 h-12 relative rounded-md overflow-hidden mr-3 bg-clay-pink flex items-center justify-center">
              <Image
                src={menu.imageUrl}
                alt={menu.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Detail Menu */}
          <div className="flex-grow">
            <p className="font-body text-sm font-semibold truncate">
              {menu.name}
            </p>
            <p className="text-xs text-warm-brown mt-0.5">
              Terjual: {menu.totalQuantity} pcs
            </p>
          </div>

          {/* Pendapatan */}
          <span className="text-sm font-bold ml-4">
            {menu.totalRevenue.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      ))}
      <div className="pt-4 text-right">
        <Link
          href="/mudir/transactions"
          className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
        >
          Lihat Detail Penjualan <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
