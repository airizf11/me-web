/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/transaction/TransactionFilter.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

interface FilterProps {
  period?: "daily" | "weekly" | "monthly" | "all" | "custom";
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

type TransactionFilterProps = {
  platformSources: string[];
  currentFilters?: FilterProps;
};

export function TransactionFilter({
  platformSources,
  currentFilters,
}: TransactionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [period, setPeriod] = useState(currentFilters?.period || "all");
  const [platform, setPlatform] = useState(currentFilters?.platform || "All");
  const [search, setSearch] = useState(currentFilters?.search || "");
  const [startDate, setStartDate] = useState(currentFilters?.startDate || "");
  const [endDate, setEndDate] = useState(currentFilters?.endDate || "");

  const [debouncedSearch] = useDebounce(search, 500);

  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (
        !["period", "platform", "search", "startDate", "endDate"].includes(key)
      ) {
        params.set(key, value);
      }
    });

    if (period && period !== "all") params.set("period", period);
    else params.delete("period");

    if (platform && platform !== "All") params.set("platform", platform);
    else params.delete("platform");

    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    const newUrl = `?${params.toString()}`;
    if (
      decodeURIComponent(searchParams.toString()) !==
      decodeURIComponent(params.toString())
    ) {
      router.push(newUrl, { scroll: false });
    }
  }, [
    period,
    platform,
    debouncedSearch,
    startDate,
    endDate,
    router,
    searchParams,
  ]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  useEffect(() => {
    setPeriod(currentFilters?.period || "all");
    setPlatform(currentFilters?.platform || "All");
    setSearch(currentFilters?.search || "");
    setStartDate(currentFilters?.startDate || "");
    setEndDate(currentFilters?.endDate || "");
  }, [currentFilters]);

  return (
    <div className="bg-light-cream p-4 rounded-md border border-clay-pink mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="periodFilter"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Periode
          </label>
          <select
            id="periodFilter"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as any);
              setStartDate("");
              setEndDate("");
            }}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          >
            <option value="all">Semua</option>
            <option value="daily">Hari Ini</option>
            <option value="weekly">Minggu Ini</option>
            <option value="monthly">Bulan Ini</option>
            <option value="custom">Rentang Kustom</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="platformFilter"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Sumber Platform
          </label>
          <select
            id="platformFilter"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          >
            {platformSources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="searchFilter"
            className="block text-sm font-body text-deep-mocha mb-1"
          >
            Cari lainnya...
          </label>
          <input
            type="text"
            id="searchFilter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            placeholder="Nama atau ID order..."
          />
        </div>
      </div>

      {period === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Dari Tanggal
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              Sampai Tanggal
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
            />
          </div>
        </div>
      )}
    </div>
  );
}
