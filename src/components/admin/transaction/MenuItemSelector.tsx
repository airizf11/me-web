/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/transaction/MenuItemSelector.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { getMenuItemsForSelector } from "@/lib/actions/transactions/read";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface MenuItemSelectorItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface SelectedTransactionItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price_at_transaction: number;
  image_url: string | null;
  subtotal: number;
}

type MenuItemSelectorProps = {
  onItemsChange: (
    items: Omit<
      SelectedTransactionItem,
      "id" | "menu_item_name" | "image_url" | "subtotal"
    >[]
  ) => void;
  onTotalAmountChange: (total: number) => void;
  initialItems?: SelectedTransactionItem[];
};

export function MenuItemSelector({
  onItemsChange,
  onTotalAmountChange,
  initialItems = [],
}: MenuItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<MenuItemSelectorItem[]>(
    []
  );
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedItems, setSelectedItems] =
    useState<SelectedTransactionItem[]>(initialItems);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onItemsChangeRef = useRef(onItemsChange);
  const onTotalAmountChangeRef = useRef(onTotalAmountChange);

  useEffect(() => {
    onItemsChangeRef.current = onItemsChange;
    onTotalAmountChangeRef.current = onTotalAmountChange;
  }, [onItemsChange, onTotalAmountChange]);

  useEffect(() => {
    const currentItemsData = selectedItems.map((item) => ({
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_transaction: item.price_at_transaction,
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
    const { data, error } = await getMenuItemsForSelector(debouncedSearchTerm);
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

  const handleAddItem = (item: MenuItemSelectorItem) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((si) => si.menu_item_id === item.id);
      if (existingItem) {
        return prevItems.map((si) =>
          si.menu_item_id === item.id
            ? {
                ...si,
                quantity: si.quantity + 1,
                subtotal: (si.quantity + 1) * si.price_at_transaction,
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
            menu_item_id: item.id,
            menu_item_name: item.name,
            quantity: 1,
            price_at_transaction: item.price,
            image_url: item.image_url,
            subtotal: item.price,
          },
        ];
      }
    });
    setSearchTerm("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems
        .map((si) =>
          si.id === itemId
            ? {
                ...si,
                quantity: Math.max(1, si.quantity + delta),
                subtotal:
                  Math.max(1, si.quantity + delta) * si.price_at_transaction,
              }
            : si
        )
        .filter((si) => si.quantity > 0);
      return updatedItems;
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prevItems) => prevItems.filter((si) => si.id !== itemId));
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="menu_search"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Cari Menu
        </label>
        <input
          type="text"
          id="menu_search"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          placeholder="Cari nama menu..."
        />
        {loadingSearch && (
          <p className="text-xs text-warm-brown mt-1">Mencari...</p>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="border border-clay-pink rounded-md max-h-40 overflow-y-auto bg-white shadow-inner">
          {searchResults.map((item) => (
            <div
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="flex items-center p-2 border-b border-clay-pink/50 last:border-b-0 hover:bg-clay-pink/50 cursor-pointer"
            >
              {item.image_url && (
                <div className="w-10 h-10 relative mr-2 rounded-sm overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="flex-grow text-deep-mocha">
                <p className="font-body text-sm">{item.name}</p>
                <p className="text-xs text-warm-brown">
                  {item.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
              <PlusCircleIcon className="h-5 w-5 text-deep-mocha" />
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-display lowercase text-deep-mocha mt-6">
        Item Transaksi
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
              className="flex items-center p-3 border-b border-clay-pink/50 last:border-b-0 bg-light-cream"
            >
              {item.image_url && (
                <div className="w-12 h-12 relative mr-3 rounded-sm overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.menu_item_name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="flex-grow text-deep-mocha">
                <p className="font-body text-base">{item.menu_item_name}</p>
                <p className="text-xs text-warm-brown">
                  {item.price_at_transaction.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
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
