/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/purchase/PurchaseItemInput.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { getRawMaterialsForSelector } from "@/lib/actions/raw_materials";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface RawMaterialSelectorItem {
  id: string;
  name: string;
  unit: string;
  last_purchase_price: number | null;
}

interface SelectedPurchaseItemUI {
  id: string; // ID unik untuk item ini di UI
  type: "raw_material" | "custom";
  raw_material_id?: string;
  raw_material_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  custom_description?: string;
  custom_category?: string;
}

type PurchaseItemInputProps = {
  onItemsChange: (
    items: Omit<SelectedPurchaseItemUI, "id" | "subtotal">[]
  ) => void;
  onTotalAmountChange: (total: number) => void;
  initialItems?: SelectedPurchaseItemUI[];
};

export function PurchaseItemInput({
  onItemsChange,
  onTotalAmountChange,
  initialItems = [],
}: PurchaseItemInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<RawMaterialSelectorItem[]>(
    []
  );
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedItems, setSelectedItems] =
    useState<SelectedPurchaseItemUI[]>(initialItems);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onItemsChangeRef = useRef(onItemsChange);
  const onTotalAmountChangeRef = useRef(onTotalAmountChange);

  useEffect(() => {
    onItemsChangeRef.current = onItemsChange;
    onTotalAmountChangeRef.current = onTotalAmountChange;
  }, [onItemsChange, onTotalAmountChange]);

  useEffect(() => {
    const currentItemsData = selectedItems.map((item) => ({
      type: item.type,
      raw_material_id: item.raw_material_id,
      raw_material_name: item.raw_material_name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      custom_description: item.custom_description || undefined,
      custom_category: item.custom_category || undefined,
    }));

    const currentItemsString = JSON.stringify(currentItemsData);
    const previousItemsString = JSON.stringify(
      (onItemsChangeRef.current as any).itemsCache || []
    );

    if (currentItemsString !== previousItemsString) {
      const total = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
      onTotalAmountChangeRef.current(total);
      onItemsChangeRef.current(currentItemsData);

      (onItemsChangeRef.current as any).itemsCache = currentItemsData;
    }
  }, [selectedItems]);

  const handleSearch = useCallback(async () => {
    if (debouncedSearchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    const { data, error } = await getRawMaterialsForSelector(
      debouncedSearchTerm
    );
    if (error) {
      toast.error(error);
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
    setLoadingSearch(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleAddItemFromSelector = (item: RawMaterialSelectorItem) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find(
        (si) => si.raw_material_id === item.id && si.type === "raw_material"
      );
      if (existingItem) {
        return prevItems.map((si) =>
          si.id === existingItem.id
            ? {
                ...si,
                quantity: si.quantity + 1,
                subtotal: (si.quantity + 1) * si.unit_price,
              }
            : si
        );
      } else {
        const uniqueLocalId = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        return [
          ...prevItems,
          {
            id: uniqueLocalId,
            type: "raw_material",
            raw_material_id: item.id,
            raw_material_name: item.name,
            quantity: 1,
            unit: item.unit,
            unit_price: item.last_purchase_price || 0,
            subtotal: item.last_purchase_price || 0,
          },
        ];
      }
    });
    setSearchTerm("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  // --- NEW: Add Custom Item & Unit Price Calculator ---
  const [customItemName, setCustomItemName] = useState("");
  const [customItemQuantity, setCustomItemQuantity] = useState(1);
  const [customItemUnit, setCustomItemUnit] = useState("");
  const [customItemUnitPrice, setCustomItemUnitPrice] = useState(0);
  const [customItemDescription, setCustomItemDescription] = useState("");
  const [customItemCategory, setCustomItemCategory] = useState("");

  // NEW: State untuk kalkulator harga per unit
  const [totalPackagePrice, setTotalPackagePrice] = useState<number | "">("");
  const [quantityInPackage, setQuantityInPackage] = useState<number | "">("");

  // Hitung unit price otomatis dari totalPackagePrice dan quantityInPackage
  useEffect(() => {
    if (
      typeof totalPackagePrice === "number" &&
      totalPackagePrice >= 0 &&
      typeof quantityInPackage === "number" &&
      quantityInPackage > 0
    ) {
      setCustomItemUnitPrice(totalPackagePrice / quantityInPackage);
    } else if (totalPackagePrice === "" && quantityInPackage === "") {
      setCustomItemUnitPrice(0); // Reset if both are empty
    }
  }, [totalPackagePrice, quantityInPackage]);

  const handleAddCustomItem = () => {
    if (
      !customItemName ||
      customItemQuantity < 1 ||
      customItemUnitPrice < 0 ||
      !customItemUnit
    ) {
      toast.error(
        "Isi semua detail item kustom dengan benar (Nama, Qty, Satuan, Harga)."
      );
      return;
    }
    const uniqueLocalId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const newItem: SelectedPurchaseItemUI = {
      id: uniqueLocalId,
      type: "custom",
      raw_material_name: customItemName,
      quantity: customItemQuantity,
      unit: customItemUnit,
      unit_price: customItemUnitPrice,
      subtotal: customItemQuantity * customItemUnitPrice,
      custom_description: customItemDescription || undefined,
      custom_category: customItemCategory || undefined,
    };
    setSelectedItems((prevItems) => [...prevItems, newItem]);

    // Reset custom item form
    setCustomItemName("");
    setCustomItemQuantity(1);
    setCustomItemUnit("");
    setCustomItemUnitPrice(0);
    setCustomItemDescription("");
    setCustomItemCategory("");
    setTotalPackagePrice(""); // Reset kalkulator
    setQuantityInPackage(""); // Reset kalkulator
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems
        .map((si) =>
          si.id === itemId
            ? {
                ...si,
                quantity: Math.max(1, si.quantity + delta),
                subtotal: Math.max(1, si.quantity + delta) * si.unit_price,
              }
            : si
        )
        .filter((si) => si.quantity > 0);
      return updatedItems;
    });
  };

  const handleUnitPriceChange = (itemId: string, newPrice: number) => {
    setSelectedItems((prevItems) => {
      return prevItems.map((si) =>
        si.id === itemId
          ? {
              ...si,
              unit_price: newPrice,
              subtotal: si.quantity * newPrice,
            }
          : si
      );
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prevItems) => prevItems.filter((si) => si.id !== itemId));
  };

  return (
    <div className="space-y-6">
      {/* Search Input for Raw Materials */}
      <div>
        <label
          htmlFor="raw_material_search"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Cari Bahan Baku (dari daftar tersimpan)
        </label>
        <input
          type="text"
          id="raw_material_search"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          placeholder="Cari nama bahan baku..."
        />
        {loadingSearch && (
          <p className="text-xs text-warm-brown mt-1">Mencari...</p>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border border-clay-pink rounded-md max-h-40 overflow-y-auto bg-white shadow-inner">
          {searchResults.map((item) => (
            <div
              key={item.id}
              onClick={() => handleAddItemFromSelector(item)}
              className="flex items-center p-2 border-b border-clay-pink/50 last:border-b-0 hover:bg-clay-pink/50 cursor-pointer"
            >
              <div className="flex-grow text-deep-mocha">
                <p className="font-body text-sm">
                  {item.name} ({item.unit})
                </p>
                {item.last_purchase_price !== null && (
                  <p className="text-xs text-warm-brown">
                    Harga terakhir:{" "}
                    {item.last_purchase_price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                    /{item.unit}
                  </p>
                )}
              </div>
              <PlusCircleIcon className="h-5 w-5 text-deep-mocha" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-warm-brown my-4">-- ATAU --</div>

      {/* NEW: Add Custom Item */}
      <div className="border border-clay-pink rounded-lg p-4 bg-light-cream space-y-3">
        <h3 className="text-lg font-display lowercase text-deep-mocha mb-3">
          tambah item kustom (manual)
        </h3>
        <div>
          <label
            htmlFor="custom_item_name"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Nama Item
          </label>
          <input
            type="text"
            id="custom_item_name"
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
            placeholder="Contoh: Alat Tulis, Jasa Perbaikan"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="custom_item_quantity"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Kuantitas
            </label>
            <input
              type="number"
              id="custom_item_quantity"
              value={customItemQuantity}
              onChange={(e) =>
                setCustomItemQuantity(parseInt(e.target.value) || 1)
              }
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
            />
          </div>
          <div>
            <label
              htmlFor="custom_item_unit"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Satuan
            </label>
            <input
              type="text"
              id="custom_item_unit"
              value={customItemUnit}
              onChange={(e) => setCustomItemUnit(e.target.value)}
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              placeholder="pcs, set, jam, bulan"
            />
          </div>
        </div>
        {/* NEW: Kalkulator Harga Per Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="total_package_price"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Total Harga Beli Paket
            </label>
            <input
              type="number"
              step="any"
              id="total_package_price"
              value={totalPackagePrice}
              onChange={(e) =>
                setTotalPackagePrice(parseFloat(e.target.value) || "")
              }
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              placeholder="Contoh: 15080"
            />
          </div>
          <div>
            <label
              htmlFor="quantity_in_package"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Kuantitas dalam Paket
            </label>
            <input
              type="number"
              step="any"
              id="quantity_in_package"
              value={quantityInPackage}
              onChange={(e) =>
                setQuantityInPackage(parseFloat(e.target.value) || "")
              }
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
              placeholder="Contoh: 25"
            />
          </div>
        </div>
        {/* End Kalkulator Harga Per Unit */}

        <div>
          <label
            htmlFor="custom_item_unit_price"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Harga Satuan (Otomatis dari Kalkulator)
          </label>
          <input
            type="number"
            step="any"
            id="custom_item_unit_price"
            value={customItemUnitPrice}
            onChange={(e) => {
              // Allow manual override if needed
              setCustomItemUnitPrice(parseFloat(e.target.value));
              setTotalPackagePrice(""); // Clear calculator inputs if manual override
              setQuantityInPackage("");
            }}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
            disabled={
              totalPackagePrice !== "" &&
              quantityInPackage !== "" &&
              customItemUnitPrice !== 0
            } // Disable if calculator is active
          />
        </div>
        {/* PENTING: Input Deskripsi Tambahan & Kategori Kustom */}
        <div>
          <label
            htmlFor="custom_item_description"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Deskripsi Tambahan (Opsional)
          </label>
          <textarea
            id="custom_item_description"
            value={customItemDescription}
            onChange={(e) => setCustomItemDescription(e.target.value)}
            rows={2}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
            placeholder="Detail lebih lanjut tentang item ini"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="custom_item_category"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Kategori Kustom (Opsional, Misal: ATK, Kebersihan)
          </label>
          <input
            type="text"
            id="custom_item_category"
            value={customItemCategory}
            onChange={(e) => setCustomItemCategory(e.target.value)}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha"
            placeholder="ATK, Perlengkapan Dapur, Jasa"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustomItem}
          className="w-full px-6 py-2 bg-clay-pink text-deep-mocha rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors"
        >
          Tambahkan Item Kustom
        </button>
      </div>

      {/* Selected Items List */}
      <h3 className="text-lg font-display lowercase text-deep-mocha mt-6">
        item pembelian
      </h3>
      {selectedItems.length === 0 ? (
        <p className="text-warm-brown text-sm">
          Belum ada item yang ditambahkan.
        </p>
      ) : (
        <div className="border border-warm-brown rounded-md overflow-hidden">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="p-3 border-b border-clay-pink/50 last:border-b-0 bg-light-cream flex items-center"
            >
              <div className="flex-grow text-deep-mocha">
                <p className="font-body text-base font-semibold">
                  {item.raw_material_name} ({item.unit})
                </p>
                {item.type === "custom" && (
                  <>
                    {item.custom_category && (
                      <p className="text-xs text-warm-brown mt-1">
                        Kategori: {item.custom_category}
                      </p>
                    )}
                    {item.custom_description && (
                      <p className="text-xs text-warm-brown mt-1">
                        {item.custom_description}
                      </p>
                    )}
                  </>
                )}
                <div className="flex items-center text-xs text-warm-brown mt-1">
                  <span className="mr-1">Harga Satuan:</span>
                  <input
                    type="number"
                    step="any"
                    value={item.unit_price}
                    onChange={(e) =>
                      handleUnitPriceChange(item.id, parseFloat(e.target.value))
                    }
                    className="w-24 p-1 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha text-right"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="p-1 rounded-full text-warm-brown hover:bg-clay-pink"
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
                <span className="font-body text-sm font-semibold">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="p-1 rounded-full text-warm-brown hover:bg-clay-pink"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 rounded-full text-red-500 hover:bg-red-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
