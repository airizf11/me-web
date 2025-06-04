/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/transaction/TransactionForm.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/actions/transaction";
import { AssetManager } from "@/components/admin/AssetManager";
import { MenuItemSelector } from "./MenuItemSelector";
import { type Transaction, type TransactionItem } from "@/lib/types";

type TransactionFormProps = {
  initialData?: Transaction | null;
};

export function TransactionForm({ initialData }: TransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const router = useRouter();

  // State untuk data transaksi
  const [transactionTimestamp, setTransactionTimestamp] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [platformSource, setPlatformSource] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerIgUsername, setCustomerIgUsername] = useState("");
  const [customerFoodDeliveryId, setCustomerFoodDeliveryId] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  // State untuk item transaksi yang dipilih
  const [selectedTransactionItems, setSelectedTransactionItems] = useState<
    Omit<
      TransactionItem,
      "id" | "transaction_id" | "created_at" | "menu_item"
    >[]
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
    setCustomerName(initialData?.customer_name || "");
    setCustomerPhone(initialData?.customer_phone || "");
    setCustomerIgUsername(initialData?.customer_ig_username || "");
    setCustomerFoodDeliveryId(initialData?.customer_food_delivery_id || "");
    setDeliveryCity(initialData?.delivery_city || "");
    setDeliveryDistrict(initialData?.delivery_district || "");
    setIsDelivery(initialData?.is_delivery ?? false);
    setIsPickup(initialData?.is_pickup ?? false);
    setScreenshotUrl(initialData?.screenshot_url || null);
    setSelectedTransactionItems(
      initialData?.items?.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price_at_transaction: item.price_at_transaction,
      })) || []
    );
    setErrors(null);
  }, [initialData]);

  useEffect(() => {
    syncFormStateWithInitialData();
  }, [syncFormStateWithInitialData]);

  // Handler untuk MenuItemSelector
  const handleSelectedItemsChange = (
    items: Omit<
      TransactionItem,
      "id" | "transaction_id" | "created_at" | "menu_item"
    >[]
  ) => {
    setSelectedTransactionItems(items);
  };

  const handleTotalAmountChange = (total: number) => {
    setTotalAmount(total);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    formData.set("items", JSON.stringify(selectedTransactionItems));

    let result;
    if (initialData?.id) {
      toast.error("Fitur edit transaksi belum diimplementasikan.");
      setLoading(false);
      return;
    } else {
      result = await createTransaction(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      syncFormStateWithInitialData();
      router.push("/mudir/transactions");
    } else {
      toast.error(result.message || "Operasi gagal.");
      if (result.errors) {
        setErrors(result.errors);
      }
      console.error("Form Submission Error:", result.errors);
    }
    setLoading(false);
  };

  const platformSources = [
    "GoFood",
    "GrabFood",
    "ShopeeFood",
    "WhatsApp",
    "Instagram",
    "Direct-Internal",
    "Walk-in",
  ];

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {/* Transaction Details */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">
          detail transaksi
        </h2>
        <div>
          <label
            htmlFor="transaction_timestamp"
            className="block text-sm font-body mb-1"
          >
            Waktu Transaksi
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
            Sumber Platform
          </label>
          <select
            id="platform_source"
            name="platform_source"
            value={platformSource}
            onChange={(e) => setPlatformSource(e.target.value)}
            className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            required
            disabled={loading}
          >
            <option value="">Pilih Sumber</option>
            {platformSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          {errors?.platform_source && (
            <p className="text-red-500 text-xs mt-1">
              {errors.platform_source[0]}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-body mb-1">
            Catatan Tambahan
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

      {/* Customer Details */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">
          detail pelanggan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customer_name"
              className="block text-sm font-body mb-1"
            >
              Nama Pelanggan
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              disabled={loading}
            />
            {errors?.customer_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customer_name[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="customer_phone"
              className="block text-sm font-body mb-1"
            >
              Nomor Telepon
            </label>
            <input
              type="text"
              id="customer_phone"
              name="customer_phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              disabled={loading}
            />
            {errors?.customer_phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customer_phone[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="customer_ig_username"
              className="block text-sm font-body mb-1"
            >
              Username Instagram
            </label>
            <input
              type="text"
              id="customer_ig_username"
              name="customer_ig_username"
              value={customerIgUsername}
              onChange={(e) => setCustomerIgUsername(e.target.value)}
              className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              disabled={loading}
            />
            {errors?.customer_ig_username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customer_ig_username[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="customer_food_delivery_id"
              className="block text-sm font-body mb-1"
            >
              ID Order Food Delivery
            </label>
            <input
              type="text"
              id="customer_food_delivery_id"
              name="customer_food_delivery_id"
              value={customerFoodDeliveryId}
              onChange={(e) => setCustomerFoodDeliveryId(e.target.value)}
              className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              disabled={loading}
            />
            {errors?.customer_food_delivery_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customer_food_delivery_id[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-body mb-2">Tipe Transaksi</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_delivery"
                name="is_delivery"
                checked={isDelivery}
                onChange={(e) => setIsDelivery(e.target.checked)}
                className="h-4 w-4 text-deep-mocha focus:ring-deep-mocha border-warm-brown rounded"
                disabled={loading}
              />
              <label
                htmlFor="is_delivery"
                className="ml-2 block text-sm font-body"
              >
                Pengiriman (Delivery)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pickup"
                name="is_pickup"
                checked={isPickup}
                onChange={(e) => setIsPickup(e.target.checked)}
                className="h-4 w-4 text-deep-mocha focus:ring-deep-mocha border-warm-brown rounded"
                disabled={loading}
              />
              <label
                htmlFor="is_pickup"
                className="ml-2 block text-sm font-body"
              >
                Ambil Sendiri (Pickup)
              </label>
            </div>
          </div>
        </div>

        {(isDelivery || initialData?.is_delivery) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="delivery_city"
                className="block text-sm font-body mb-1"
              >
                Kota Pengiriman
              </label>
              <input
                type="text"
                id="delivery_city"
                name="delivery_city"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
                disabled={loading}
              />
              {errors?.delivery_city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.delivery_city[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="delivery_district"
                className="block text-sm font-body mb-1"
              >
                Kecamatan Pengiriman
              </label>
              <input
                type="text"
                id="delivery_district"
                name="delivery_district"
                value={deliveryDistrict}
                onChange={(e) => setDeliveryDistrict(e.target.value)}
                className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
                disabled={loading}
              />
              {errors?.delivery_district && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.delivery_district[0]}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MenuItem Selector - Tambahkan styling blok berwarna */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        {" "}
        {/* Blok berwarna */}
        <h2 className="text-xl font-display lowercase mb-4">
          item yang terjual
        </h2>
        <MenuItemSelector
          onItemsChange={handleSelectedItemsChange}
          onTotalAmountChange={handleTotalAmountChange}
          initialItems={initialData?.items?.map((item) => ({
            id: item.id,
            menu_item_id: item.menu_item_id,
            menu_item_name: item.menu_item?.name || "Unknown Item",
            quantity: item.quantity,
            price_at_transaction: item.price_at_transaction,
            image_url: item.menu_item?.image_url || null,
            subtotal: item.quantity * item.price_at_transaction,
          }))}
        />
        {errors?.items && (
          <p className="text-red-500 text-xs mt-1">{errors.items[0]}</p>
        )}
        <div className="mt-6 border-t border-clay-pink/50 pt-4 flex justify-between items-center text-deep-mocha">
          {" "}
          {/* Border dan teks agar sesuai konteks */}
          <span className="text-lg font-body">Total Transaksi:</span>
          <span className="text-2xl font-display font-bold">
            {totalAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
          <input type="hidden" name="total_amount" value={totalAmount} />
        </div>
      </div>

      {/* Screenshot Upload - Tambahkan styling blok berwarna */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        {" "}
        {/* Blok berwarna */}
        <h2 className="text-xl font-display lowercase mb-4">
          screenshot transaksi (opsional)
        </h2>
        <AssetManager
          onAssetSelect={setScreenshotUrl}
          initialAssetUrl={initialData?.screenshot_url}
          allowedFileTypes="image/*"
          bucketName="assets"
          fileInputLabel="Pilih screenshot transaksi"
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
          onClick={() => router.push("/mudir/transactions")}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading || selectedTransactionItems.length === 0}
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
              {"Menyimpan Transaksi..."}
            </>
          ) : initialData ? (
            "Simpan Perubahan Transaksi"
          ) : (
            "Catat Transaksi"
          )}
        </button>
      </div>
    </form>
  );
}
