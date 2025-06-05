// src/lib/actions/transactions/read.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction, type MenuItem } from "@/lib/types";

// --- GET TRANSACTIONS (dengan filter, untuk halaman daftar) ---
export async function getTransactions(
  filters: {
    period?: "daily" | "weekly" | "monthly" | "all";
    platform?: string; // Ubah nama parameter agar tidak konflik dengan platform_source di DB
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
  if (filters.period) {
    const now = new Date();
    let startDate;
    const endDate = now.toISOString();

    if (filters.period === "daily") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();
    } else if (filters.period === "weekly") {
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      ); // Sunday
      startDate = new Date(
        firstDayOfWeek.getFullYear(),
        firstDayOfWeek.getMonth(),
        firstDayOfWeek.getDate()
      ).toISOString();
    } else if (filters.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }

    if (startDate) {
      query = query
        .gte("transaction_timestamp", startDate)
        .lte("transaction_timestamp", endDate);
    }
  }

  if (filters.platform && filters.platform !== "All") {
    // Gunakan filters.platform
    query = query.eq("platform_source", filters.platform);
  }

  if (filters.search) {
    const searchTerm = `%${filters.search.toLowerCase()}%`;
    query = query.or(
      `customer_name.ilike.${searchTerm},customer_food_delivery_id.ilike.${searchTerm}`
    );
  }

  // Custom date range filter
  if (filters.startDate && filters.endDate) {
    query = query
      .gte("transaction_timestamp", filters.startDate)
      .lte("transaction_timestamp", filters.endDate);
  }

  // Filter berdasarkan tipe transaksi
  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return { data: [], error: `Gagal memuat transaksi: ${error.message}` };
  }

  return { data: data as unknown as Transaction[], error: null };
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
