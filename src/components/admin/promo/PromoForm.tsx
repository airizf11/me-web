// src/components/admin/promo/PromoForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { type Promo, type MenuItem } from "@/lib/types";
import { createPromo, updatePromo } from "@/lib/actions/promo";
import { getMenuItemsForSelector } from "@/lib/actions/transactions/read"; // Re-use dari transaksi
import { useDebounce } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/24/outline";

type PromoFormProps = {
  initialData?: Promo | null;
};

export function PromoForm({ initialData }: PromoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  const [targetType, setTargetType] = useState<
    "all" | "category" | "menu_item"
  >(initialData?.target_type || "all");
  const [targetIds, setTargetIds] = useState<string[]>(
    initialData?.target_ids || []
  );
  const [targetMenuItems, setTargetMenuItems] = useState<
    Pick<MenuItem, "id" | "name">[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<
    Pick<MenuItem, "id" | "name">[]
  >([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const fetchSelectedMenus = async () => {
      if (
        initialData?.target_type === "menu_item" &&
        initialData.target_ids &&
        initialData.target_ids.length > 0
      ) {
        const supabase = (await import("@/lib/supabase/client")).createClient();
        const { data, error } = await supabase
          .from("menus")
          .select("id, name")
          .in("id", initialData.target_ids);
        if (!error) setTargetMenuItems(data);
      }
    };
    fetchSelectedMenus();
  }, [initialData]);

  const searchMenus = useCallback(async () => {
    if (debouncedSearchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    const { data } = await getMenuItemsForSelector(debouncedSearchTerm);
    setSearchResults(data);
    setLoadingSearch(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    searchMenus();
  }, [searchMenus]);

  const handleAddTarget = (id: string, name: string) => {
    if (!targetIds.includes(id)) {
      setTargetIds([...targetIds, id]);
      setTargetMenuItems([...targetMenuItems, { id, name }]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveTarget = (idToRemove: string) => {
    setTargetIds(targetIds.filter((id) => id !== idToRemove));
    setTargetMenuItems(
      targetMenuItems.filter((item) => item.id !== idToRemove)
    );
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    toast.dismiss();

    formData.set("target_ids", JSON.stringify(targetIds));

    let result;
    if (initialData?.id) {
      result = await updatePromo(initialData.id, formData);
    } else {
      result = await createPromo(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      router.push("/mudir/promos");
    } else {
      toast.error(result.message || "Operasi gagal.");
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Nama Promo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={initialData?.name || ""}
            className="w-full p-2 border border-warm-brown rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Kode Promo (Opsional)
          </label>
          <input
            type="text"
            id="code"
            name="code"
            defaultValue={initialData?.code || ""}
            className="w-full p-2 border border-warm-brown rounded-md"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ""}
          rows={3}
          className="w-full p-2 border border-warm-brown rounded-md"
          required
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Tipe Promo
          </label>
          <select
            id="type"
            name="type"
            defaultValue={initialData?.type || "percentage"}
            className="w-full p-2 border border-warm-brown rounded-md"
          >
            <option value="percentage">Persentase (%)</option>
            <option value="fixed_amount">Potongan Harga Tetap (Rp)</option>
            <option value="bogo">Beli 1 Gratis 1 (BOGO)</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="value"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Nilai Promo
          </label>
          <input
            type="number"
            id="value"
            name="value"
            defaultValue={initialData?.value || 0}
            step="any"
            className="w-full p-2 border border-warm-brown rounded-md"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Tanggal Mulai
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            defaultValue={formatDateForInput(initialData?.start_date)}
            className="w-full p-2 border border-warm-brown rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Tanggal Berakhir
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            defaultValue={formatDateForInput(initialData?.end_date)}
            className="w-full p-2 border border-warm-brown rounded-md"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="min_order_amount"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Minimal Pembelian (Opsional)
        </label>
        <input
          type="number"
          id="min_order_amount"
          name="min_order_amount"
          defaultValue={initialData?.min_order_amount || 0}
          step="any"
          className="w-full p-2 border border-warm-brown rounded-md"
        />
      </div>

      <div className="border border-warm-brown rounded-lg p-4 bg-light-cream">
        <h3 className="text-lg font-display lowercase text-deep-mocha mb-4">
          Target Promo
        </h3>
        <div>
          <label
            htmlFor="target_type"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Terapkan Promo Untuk
          </label>
          <select
            id="target_type"
            name="target_type"
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value as any);
              setTargetIds([]);
              setTargetMenuItems([]);
            }}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
          >
            <option value="all">Semua Menu</option>
            <option value="category">Kategori Tertentu</option>
            <option value="menu_item">Menu Tertentu</option>
          </select>
        </div>

        {targetType === "category" && (
          <div className="mt-4">
            <label
              htmlFor="target_ids_category"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Nama Kategori (pisahkan dengan koma)
            </label>
            <input
              type="text"
              id="target_ids_category"
              value={targetIds.join(",")}
              onChange={(e) =>
                setTargetIds(e.target.value.split(",").map((s) => s.trim()))
              }
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              placeholder="Contoh: Coffee, Non-Coffee"
            />
          </div>
        )}

        {targetType === "menu_item" && (
          <div className="mt-4 space-y-3">
            <label
              htmlFor="target_search_menu"
              className="block text-sm font-body text-deep-mocha"
            >
              Pilih Menu
            </label>
            <input
              type="text"
              id="target_search_menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              placeholder="Cari nama menu untuk ditambahkan..."
            />
            {loadingSearch && (
              <p className="text-xs text-warm-brown mt-1">Mencari...</p>
            )}
            {searchResults.length > 0 && (
              <div className="border border-clay-pink rounded-md max-h-40 overflow-y-auto bg-white shadow-inner">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAddTarget(item.id, item.name)}
                    className="p-2 border-b last:border-b-0 hover:bg-clay-pink/50 cursor-pointer text-deep-mocha"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
            {targetMenuItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {targetMenuItems.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center bg-clay-pink text-deep-mocha px-3 py-1 rounded-full text-sm"
                  >
                    {item.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTarget(item.id)}
                      className="ml-2 text-deep-mocha hover:text-red-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          defaultChecked={initialData?.is_active ?? false}
          className="h-4 w-4 text-deep-mocha focus:ring-deep-mocha border-warm-brown rounded"
        />
        <label
          htmlFor="is_active"
          className="ml-2 block text-sm font-body text-deep-mocha"
        >
          Aktifkan Promo Ini
        </label>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/mudir/promos")}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : initialData
            ? "Simpan Perubahan"
            : "Buat Promo"}
        </button>
      </div>
    </form>
  );
}
