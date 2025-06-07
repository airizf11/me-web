/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/purchase/PurchaseForm.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  createPurchaseTransaction,
  updatePurchaseTransaction,
} from "@/lib/actions/transactions/purchases"; // Server Actions
import { AssetManager } from "@/components/admin/AssetManager";
import { PurchaseItemInput } from "./PurchaseItemInput"; // Import PurchaseItemInput
import { type Transaction, type PurchaseItem } from "@/lib/types"; // Import tipe

type PurchaseFormProps = {
  initialData?: Transaction | null; // Untuk mode edit (opsional saat ini)
};

export function PurchaseForm({ initialData }: PurchaseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false); // Untuk tombol submit utama
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const router = useRouter();

  // State untuk data transaksi pembelian
  const [transactionTimestamp, setTransactionTimestamp] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [platformSource, setPlatformSource] = useState(""); // Untuk supplier/sumber pembelian
  const [notes, setNotes] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  // State untuk item pembelian yang dipilih
  const [selectedPurchaseItems, setSelectedPurchaseItems] = useState<
    Omit<PurchaseItem, "id" | "subtotal">[] // Sesuaikan tipe di sini
  >([]);

  // Callback untuk sinkronisasi state form
  const syncFormStateWithInitialData = useCallback(() => {
    const now = new Date();
    const defaultTimestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setTransactionTimestamp(
      initialData?.transaction_timestamp
        ? new Date(initialData.transaction_timestamp)
            .toISOString()
            .substring(0, 16)
        : defaultTimestamp
    );
    setTotalAmount(initialData?.total_amount || 0);
    setPlatformSource(initialData?.platform_source || "");
    setNotes(initialData?.notes || "");
    setScreenshotUrl(initialData?.screenshot_url || null);
    // PENTING: Pastikan initialData?.purchase_items_json adalah array saat inisialisasi
    setSelectedPurchaseItems(
      Array.isArray(initialData?.purchase_items_json)
        ? initialData.purchase_items_json.map((item) => ({
            type: item.type,
            raw_material_id: item.raw_material_id,
            raw_material_name: item.raw_material_name,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            custom_description: item.custom_description,
            custom_category: item.custom_category,
          }))
        : []
    );
    setErrors(null);
  }, [initialData]);

  useEffect(() => {
    syncFormStateWithInitialData();
  }, [syncFormStateWithInitialData]);

  // Handler untuk PurchaseItemInput
  const handleSelectedItemsChange = (
    items: Omit<PurchaseItem, "id" | "subtotal">[]
  ) => {
    setSelectedPurchaseItems(items);
  };

  const handleTotalAmountChange = (total: number) => {
    setTotalAmount(total);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    // Pastikan item pembelian dimasukkan sebagai JSON string
    formData.set("items", JSON.stringify(selectedPurchaseItems));
    // Set type dan status untuk transaksi pembelian
    formData.set("type", "purchase");
    formData.set("status", "paid"); // Atau 'pending', 'received'

    let result;
    if (initialData?.id) {
      // Untuk mode edit, kita akan implementasikan nanti
      result = await updatePurchaseTransaction(initialData.id, formData);
    } else {
      result = await createPurchaseTransaction(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      syncFormStateWithInitialData(); // Reset form ke default
      router.push("/mudir/purchases"); // Redirect ke halaman daftar pembelian
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
      {/* Transaction Details (Pembelian) */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">
          detail pembelian
        </h2>
        <div>
          <label
            htmlFor="transaction_timestamp"
            className="block text-sm font-body mb-1"
          >
            Waktu Pembelian
          </label>
          <input
            type="datetime-local"
            id="transaction_timestamp"
            name="transaction_timestamp"
            value={transactionTimestamp}
            onChange={(e) => setTransactionTimestamp(e.target.value)}
            className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            required
            disabled={loading}
          />
          {errors?.transaction_timestamp && (
            <p className="text-red-500 text-xs mt-1">
              {errors.transaction_timestamp[0]}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="platform_source"
            className="block text-sm font-body mb-1"
          >
            Sumber Pembelian (Supplier/Toko)
          </label>
          <input
            type="text"
            id="platform_source"
            name="platform_source"
            value={platformSource}
            onChange={(e) => setPlatformSource(e.target.value)}
            className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            required
            disabled={loading}
          />
          {errors?.platform_source && (
            <p className="text-red-500 text-xs mt-1">
              {errors.platform_source[0]}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-body mb-1">
            Catatan Tambahan (Misal: No. Invoice)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            disabled={loading}
          ></textarea>
          {errors?.notes && (
            <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>
          )}
        </div>
      </div>

      {/* PurchaseItem Input - Tambahkan styling blok berwarna */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">item pembelian</h2>
        <PurchaseItemInput
          onItemsChange={handleSelectedItemsChange}
          onTotalAmountChange={handleTotalAmountChange}
          initialItems={
            Array.isArray(initialData?.purchase_items_json)
              ? initialData.purchase_items_json.map((item) => ({
                  id:
                    item.raw_material_id ||
                    `${item.raw_material_name}-${item.quantity}-${item.unit_price}`, // Fallback ID
                  type: item.type,
                  raw_material_id: item.raw_material_id,
                  raw_material_name: item.raw_material_name,
                  quantity: item.quantity,
                  unit: item.unit,
                  unit_price: item.unit_price,
                  subtotal: item.quantity * item.unit_price,
                  custom_description: item.custom_description,
                  custom_category: item.custom_category,
                }))
              : []
          }
        />
        {errors?.items && (
          <p className="text-red-500 text-xs mt-1">{errors.items[0]}</p>
        )}

        <div className="mt-6 border-t border-clay-pink/50 pt-4 flex justify-between items-center text-deep-mocha">
          <span className="text-lg font-body">Total Pembelian:</span>
          <span className="text-2xl font-display font-bold">
            {totalAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
          <input type="hidden" name="total_amount" value={totalAmount} />
        </div>
      </div>

      {/* Screenshot Bukti Pembelian */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">
          bukti pembelian (opsional)
        </h2>
        <AssetManager
          onAssetSelect={setScreenshotUrl}
          initialAssetUrl={initialData?.screenshot_url}
          allowedFileTypes="image/*"
          bucketName="assets"
          fileInputLabel="Pilih bukti pembelian"
        />
        {errors?.screenshot_url && (
          <p className="text-red-500 text-xs mt-1">
            {errors.screenshot_url[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/mudir/purchases")}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading || selectedPurchaseItems.length === 0}
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
              {"Menyimpan Pembelian..."}
            </>
          ) : initialData ? (
            "Simpan Perubahan Pembelian"
          ) : (
            "Catat Pembelian"
          )}
        </button>
      </div>
    </form>
  );
}
