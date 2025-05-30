// src/components/admin/menu/MenuTable.tsx
"use client";

import Image from "next/image";
import { type MenuItem } from "@/lib/types";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { deleteMenuItem, toggleMenuItemAvailability } from "@/lib/actions/menu"; // Import Server Actions
import toast from "react-hot-toast"; // Import toast untuk notifikasi

type MenuTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void; // Prop baru untuk callback edit
};

export function MenuTable({ items, onEdit }: MenuTableProps) {
  const handleDelete = async (item: MenuItem) => {
    if (
      confirm(
        `Yakin ingin menghapus menu "${item.name}"? Aksi ini tidak dapat dibatalkan.`
      )
    ) {
      toast.loading("Menghapus menu...");
      const result = await deleteMenuItem(item.id);
      toast.dismiss(); // Tutup loading toast
      if (result.success) {
        toast.success(result.message);
        // Data akan otomatis terupdate karena revalidatePath di Server Action
      } else {
        toast.error(result.message || "Gagal menghapus menu.");
      }
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    toast.loading("Mengubah status...");
    const result = await toggleMenuItemAvailability(item.id, item.is_available);
    toast.dismiss();
    if (result.success) {
      toast.success(result.message);
      // Data akan otomatis terupdate karena revalidatePath di Server Action
    } else {
      toast.error(result.message || "Gagal mengubah status.");
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
              Gambar
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Nama Menu
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Harga
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
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-clay-pink/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-clay-pink flex items-center justify-center">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: "cover" }}
                      className="object-center"
                    />
                  ) : (
                    <span className="text-xs text-warm-brown">No Image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body">{item.name}</div>
                <div className="text-xs text-warm-brown font-body">
                  {item.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-body">
                {item.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    item.is_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.is_available ? "Tersedia" : "Tidak Tersedia"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2 justify-end">
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label={item.is_available ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {item.is_available ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="Hapus"
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
