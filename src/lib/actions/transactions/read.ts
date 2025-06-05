// src/lib/actions/transactions/read.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction, type MenuItem } from "@/lib/types";

// --- GET TRANSACTIONS (dengan filter, untuk halaman daftar) ---
export async function getTransactions(
  filters: {
    period?: "daily" | "weekly" | "monthly" | "all" | "custom";
    platform?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    type?: "sale" | "purchase" | "all"; // Filter baru untuk tipe transaksi
  } = {}
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("transactions")
    .select(
      `
    id,
    transaction_timestamp,
    total_amount,
    platform_source,
    customer_name,
    customer_food_delivery_id,
    type,
    status
  `
    )
    .order("transaction_timestamp", { ascending: false });

  // Implementasi filtering (contoh sederhana)
  if (
    filters.period &&
    filters.period !== "all" &&
    filters.period !== "custom"
  ) {
    const now = new Date();
    let startDate: Date;
    const endDate: Date = new Date(); // Default to current time for endDate

    // Set time to start/end of day/week/month
    now.setHours(0, 0, 0, 0); // Reset time to midnight for daily/weekly/monthly calculations
    endDate.setHours(23, 59, 59, 999); // Set end of day for endDate

    if (filters.period === "daily") {
      startDate = now; // Already set to midnight of current day
    } else if (filters.period === "weekly") {
      const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
      startDate = new Date(now.setDate(now.getDate() - dayOfWeek)); // Start of the current week (Sunday)
    } else if (filters.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    } else {
      // Should not happen with 'all' and 'custom' already filtered
      startDate = new Date(); // Fallback
    }

    query = query
      .gte("transaction_timestamp", startDate.toISOString())
      .lte("transaction_timestamp", endDate.toISOString());
  }

  // --- FILTER BY CUSTOM DATE RANGE ---
  // Ini akan menimpa filter period jika period === 'custom'
  if (filters.period === "custom" && filters.startDate && filters.endDate) {
    // Pastikan endDate mencakup seluruh hari (sampai akhir hari)
    const endOfDay = new Date(filters.endDate);
    endOfDay.setHours(23, 59, 59, 999);
    query = query
      .gte("transaction_timestamp", new Date(filters.startDate).toISOString())
      .lte("transaction_timestamp", endOfDay.toISOString());
  }

  // --- FILTER BY PLATFORM SOURCE ---
  // Menggunakan 'platform' dari filter, bukan 'platformSource' (konsistensi)
  if (filters.platform && filters.platform !== "All") {
    query = query.eq("platform_source", filters.platform);
  }

  // --- FILTER BY SEARCH TERM (customer name / food delivery ID) ---
  if (filters.search) {
    const searchTerm = `%${filters.search.toLowerCase()}%`;
    query = query.or(
      `customer_name.ilike.${searchTerm},customer_food_delivery_id.ilike.${searchTerm}`
    );
  }

  // --- FILTER BY TRANSACTION TYPE ---
  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return { data: [], error: `Gagal memuat transaksi: ${error.message}` };
  }

  return { data: data as Transaction[], error: null };
}

// --- GET TRANSACTION DETAILS (untuk halaman detail) ---
export async function getTransactionDetails(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      items:transaction_items (
        id,
        quantity,
        price_at_transaction,
        menu_item:menus (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching transaction details:", error.message);
    return {
      data: null,
      error: `Gagal memuat detail transaksi: ${error.message}`,
    };
  }

  return { data: data as Transaction, error: null };
}

// --- GET MENU ITEMS FOR SELECTOR (Server Action untuk MenuItemSelector) ---
// PENTING: Fungsi ini yang sebelumnya hilang
export async function getMenuItemsForSelector(search: string = "") {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("menus")
    .select("id, name, price, image_url")
    .eq("is_available", true);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  query = query.order("name", { ascending: true }).limit(10); // Limit hasil pencarian

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching menu items for selector:", error.message);
    return { data: [], error: `Gagal memuat item menu: ${error.message}` };
  }
  return {
    data: data as Pick<MenuItem, "id" | "name" | "price" | "image_url">[],
    error: null,
  };
}
