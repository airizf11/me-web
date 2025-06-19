// src/components/admin/promo/PromoTable.tsx
"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { type Promo } from "@/lib/types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deletePromo } from "@/lib/actions/promo";

type PromoTableProps = { promos: Promo[] };

export function PromoTable({ promos }: PromoTableProps) {
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus promo "${name}"?`)) {
      toast.loading("Menghapus...");
      const result = await deletePromo(id);
      toast.dismiss();
      if (result.success) toast.success(result.message);
      else toast.error(result.message || "Gagal menghapus.");
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
              Nama Promo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Kode
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Tipe
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Berlaku
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
          {promos.map((promo) => (
            <tr
              key={promo.id}
              className="hover:bg-clay-pink/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body">
                  {promo.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">{promo.code || "-"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body capitalize">
                  {promo.type.replace("_", " ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(promo.start_date).toLocaleDateString("id-ID")} -{" "}
                {new Date(promo.end_date).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    promo.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {promo.is_active ? "Aktif" : "Non-aktif"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2 justify-end">
                  <Link
                    href={`/mudir/promos/${promo.id}/edit`}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(promo.id, promo.name)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100"
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
