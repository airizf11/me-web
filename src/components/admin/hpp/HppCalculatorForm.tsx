/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/hpp/HppCalculatorForm.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

interface RecipeIngredient {
  id: string;
  raw_material_id: string;
  raw_material_name: string;
  quantity_used: number;
  unit: string;
  unit_price: number;
  cost: number;
}

export function HppCalculatorForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<RawMaterialSelectorItem[]>(
    []
  );
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [totalHpp, setTotalHpp] = useState(0);
  const [targetMarginPercentage, setTargetMarginPercentage] = useState(30);
  const [recommendedSellingPrice, setRecommendedSellingPrice] = useState(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);

  useEffect(() => {
    const calculatedHpp = ingredients.reduce((sum, item) => sum + item.cost, 0);
    setTotalHpp(calculatedHpp);

    if (targetMarginPercentage >= 100) {
      setRecommendedSellingPrice(0);
      setEstimatedProfit(0);
      return;
    }

    const marginFactor = 1 - targetMarginPercentage / 100;
    const calculatedSellingPrice = calculatedHpp / marginFactor;
    setRecommendedSellingPrice(calculatedSellingPrice);
    setEstimatedProfit(calculatedSellingPrice - calculatedHpp);
  }, [ingredients, targetMarginPercentage]);

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

  const handleAddIngredient = (item: RawMaterialSelectorItem) => {
    setIngredients((prevIngredients) => {
      const existingIngredient = prevIngredients.find(
        (ing) => ing.raw_material_id === item.id
      );
      if (existingIngredient) {
        toast("Bahan baku sudah ada di resep. Silakan ubah kuantitasnya.", {
          icon: "ℹ️",
        });
        return prevIngredients;
      }
      const uniqueLocalId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      return [
        ...prevIngredients,
        {
          id: uniqueLocalId,
          raw_material_id: item.id,
          raw_material_name: item.name,
          quantity_used: 1,
          unit: item.unit,
          unit_price: item.last_purchase_price || 0,
          cost: item.last_purchase_price || 0,
        },
      ];
    });
    setSearchTerm("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleQuantityUsedChange = (
    ingredientId: string,
    newQuantity: number
  ) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ing) =>
        ing.id === ingredientId
          ? {
              ...ing,
              quantity_used: Math.max(0, newQuantity),
              cost: Math.max(0, newQuantity) * ing.unit_price,
            }
          : ing
      )
    );
  };

  const handleUnitPriceChange = (ingredientId: string, newPrice: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ing) =>
        ing.id === ingredientId
          ? {
              ...ing,
              unit_price: newPrice,
              cost: ing.quantity_used * newPrice,
            }
          : ing
      )
    );
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== ingredientId)
    );
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  return (
    <div className="space-y-6">
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">Resep Sajian</h2>
        <div>
          <label
            htmlFor="ingredient_search"
            className="block text-sm font-body mb-1"
          >
            Cari Bahan Baku
          </label>
          <input
            type="text"
            id="ingredient_search"
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            placeholder="Cari nama bahan baku..."
          />
          {loadingSearch && (
            <p className="text-xs text-warm-brown mt-1">Mencari...</p>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="border border-clay-pink rounded-md max-h-40 overflow-y-auto bg-white shadow-inner mt-2">
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddIngredient(item)}
                className="flex items-center p-2 border-b border-clay-pink/50 last:border-b-0 hover:bg-clay-pink/50 cursor-pointer text-deep-mocha"
              >
                <div className="flex-grow">
                  <p className="font-body text-sm">
                    {item.name} ({item.unit})
                  </p>
                  {item.last_purchase_price !== null && (
                    <p className="text-xs text-warm-brown">
                      Harga terakhir: {formatCurrency(item.last_purchase_price)}
                      /{item.unit}
                    </p>
                  )}
                </div>
                <PlusCircleIcon className="h-5 w-5" />
              </div>
            ))}
          </div>
        )}

        <h3 className="text-lg font-display lowercase mt-6 mb-3">
          bahan baku dalam resep
        </h3>
        {ingredients.length === 0 ? (
          <p className="text-light-cream/70 text-sm">
            Tambahkan bahan baku untuk menghitung HPP.
          </p>
        ) : (
          <div className="border border-light-cream rounded-md overflow-hidden">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="flex items-center p-3 border-b border-clay-pink/50 last:border-b-0 bg-light-cream text-deep-mocha"
              >
                <div className="flex-grow">
                  <p className="font-body text-base font-semibold">
                    {ing.raw_material_name}
                  </p>
                  <div className="flex items-center text-xs text-warm-brown mt-1">
                    <span className="mr-1">Kuantitas Digunakan:</span>
                    <input
                      type="number"
                      step="any"
                      value={ing.quantity_used}
                      onChange={(e) =>
                        handleQuantityUsedChange(
                          ing.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-20 p-1 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha text-right"
                    />
                    <span className="ml-1">{ing.unit}</span>
                  </div>
                  <div className="flex items-center text-xs text-warm-brown mt-1">
                    <span className="mr-1">Harga per {ing.unit}:</span>
                    <input
                      type="number"
                      step="any"
                      value={ing.unit_price}
                      onChange={(e) =>
                        handleUnitPriceChange(
                          ing.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-24 p-1 border border-clay-pink rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha text-right"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-body text-base font-semibold">
                    {formatCurrency(ing.cost)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
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

      <div className="bg-light-cream text-deep-mocha p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase mb-4">Hasil Kalkulasi</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-warm-brown pb-2">
            <span className="font-body text-lg">Total HPP per Sajian:</span>
            <span className="font-display text-2xl font-bold">
              {formatCurrency(totalHpp)}
            </span>
          </div>

          <div>
            <label
              htmlFor="targetMargin"
              className="block text-sm font-body mb-1"
            >
              Target Margin Keuntungan (%)
            </label>
            <input
              type="number"
              id="targetMargin"
              value={targetMarginPercentage}
              onChange={(e) =>
                setTargetMarginPercentage(parseFloat(e.target.value))
              }
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              min="0"
              max="99"
            />
          </div>

          <div className="flex justify-between items-center border-t border-warm-brown pt-2 mt-4">
            <span className="font-body text-lg">Harga Jual Rekomendasi:</span>
            <span className="font-display text-2xl font-bold">
              {formatCurrency(recommendedSellingPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-lg">Estimasi Profit (Margin):</span>
            <span className="font-display text-2xl font-bold">
              {formatCurrency(estimatedProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
