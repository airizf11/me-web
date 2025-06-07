/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/raw-material/RawMaterialForm.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { type RawMaterial } from "@/lib/types";
import {
  createRawMaterial,
  updateRawMaterial,
} from "@/lib/actions/raw_materials"; // Import Server Actions
import { useRouter } from "next/navigation";

type RawMaterialFormProps = {
  initialData?: RawMaterial | null; // Untuk mode edit
};

export function RawMaterialForm({ initialData }: RawMaterialFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const router = useRouter();

  // State lokal untuk form input
  const [name, setName] = useState(initialData?.name || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [currentStock, setCurrentStock] = useState(
    initialData?.current_stock || 0
  );
  const [lastPurchasePrice, setLastPurchasePrice] = useState(
    initialData?.last_purchase_price || 0
  );
  const [supplier, setSupplier] = useState(initialData?.supplier || "");

  useEffect(() => {
    setName(initialData?.name || "");
    setUnit(initialData?.unit || "");
    setCurrentStock(initialData?.current_stock || 0);
    setLastPurchasePrice(initialData?.last_purchase_price || 0);
    setSupplier(initialData?.supplier || "");
    setErrors(null);
  }, [initialData]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    let result;
    if (initialData?.id) {
      result = await updateRawMaterial(initialData.id, formData);
    } else {
      result = await createRawMaterial(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      router.push("/mudir/raw-materials"); // Redirect kembali ke halaman daftar bahan baku
    } else {
      toast.error(result.message || "Operasi gagal.");
      if (result.errors) {
        setErrors(result.errors);
      }
      console.error("Form Submission Error:", result.errors);
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Nama Bahan Baku
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="unit"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Satuan (Contoh: gram, liter, pcs)
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.unit && (
          <p className="text-red-500 text-xs mt-1">{errors.unit[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="current_stock"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Stok Saat Ini
        </label>
        <input
          type="number"
          id="current_stock"
          name="current_stock"
          step="any"
          value={currentStock}
          onChange={(e) => setCurrentStock(parseFloat(e.target.value))}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.current_stock && (
          <p className="text-red-500 text-xs mt-1">{errors.current_stock[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="last_purchase_price"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Harga Beli Terakhir (Opsional)
        </label>
        <input
          type="number"
          id="last_purchase_price"
          name="last_purchase_price"
          step="any"
          value={lastPurchasePrice}
          onChange={(e) => setLastPurchasePrice(parseFloat(e.target.value))}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        />
        {errors?.last_purchase_price && (
          <p className="text-red-500 text-xs mt-1">
            {errors.last_purchase_price[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="supplier"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Supplier (Opsional)
        </label>
        <input
          type="text"
          id="supplier"
          name="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        />
        {errors?.supplier && (
          <p className="text-red-500 text-xs mt-1">{errors.supplier[0]}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/mudir/raw-materials")}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading
            ? initialData
              ? "Menyimpan..."
              : "Menambahkan..."
            : initialData
            ? "Simpan Perubahan"
            : "Tambah Bahan Baku"}
        </button>
      </div>
    </form>
  );
}
