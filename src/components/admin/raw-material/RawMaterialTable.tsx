// src/components/admin/raw-material/RawMaterialTable.tsx
"use client";

import Link from "next/link";
import { type RawMaterial } from "@/lib/types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { deleteRawMaterial } from "@/lib/actions/raw_materials";

type RawMaterialTableProps = {
  rawMaterials: RawMaterial[];
};

export function RawMaterialTable({ rawMaterials }: RawMaterialTableProps) {
  const handleDelete = async (rawMaterial: RawMaterial) => {
    if (
      confirm(
        `Yakin ingin menghapus bahan baku "${rawMaterial.name}"? Aksi ini tidak dapat dibatalkan.`
      )
    ) {
      toast.loading("Menghapus bahan baku...");
      const result = await deleteRawMaterial(rawMaterial.id);
      toast.dismiss();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menghapus bahan baku.");
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
              Nama Bahan Baku
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Satuan
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Stok Saat Ini
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Harga Beli Terakhir
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Supplier
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
          {rawMaterials.map((rm) => (
            <tr key={rm.id} className="hover:bg-clay-pink/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body">{rm.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">{rm.unit}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">
                  {rm.current_stock.toLocaleString("id-ID")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-body">
                {rm.last_purchase_price
                  ? rm.last_purchase_price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-body">{rm.supplier || "-"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2 justify-end">
                  <Link
                    href={`/mudir/raw-materials/${rm.id}/edit`}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(rm)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="Delete"
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
