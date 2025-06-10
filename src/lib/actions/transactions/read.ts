// src/lib/actions/transactions/read.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction, type MenuItem } from "@/lib/types";

export async function getTransactions(
  filters: {
    period?: "daily" | "weekly" | "monthly" | "all" | "custom";
    platform?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    type?: "sale" | "purchase" | "all";
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

  if (
    filters.period &&
    filters.period !== "all" &&
    filters.period !== "custom"
  ) {
    const now = new Date();
    let startDate: Date;
    const endDate: Date = new Date();

    now.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (filters.period === "daily") {
      startDate = now;
    } else if (filters.period === "weekly") {
      const dayOfWeek = now.getDay();
      startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
    } else if (filters.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date();
    }

    query = query
      .gte("transaction_timestamp", startDate.toISOString())
      .lte("transaction_timestamp", endDate.toISOString());
  }

  if (filters.period === "custom" && filters.startDate && filters.endDate) {
    const endOfDay = new Date(filters.endDate);
    endOfDay.setHours(23, 59, 59, 999);
    query = query
      .gte("transaction_timestamp", new Date(filters.startDate).toISOString())
      .lte("transaction_timestamp", endOfDay.toISOString());
  }

  if (filters.platform && filters.platform !== "All") {
    query = query.eq("platform_source", filters.platform);
  }

  if (filters.search) {
    const searchTerm = `%${filters.search.toLowerCase()}%`;
    query = query.or(
      `customer_name.ilike.${searchTerm},customer_food_delivery_id.ilike.${searchTerm},platform_source.ilike.${searchTerm},notes.ilike.${searchTerm},type.ilike.${searchTerm},delivery_city.ilike.${searchTerm},status.ilike.${searchTerm}`
    );
  }

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

export async function getMenuItemsForSelector(search: string = "") {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("menus")
    .select("id, name, price, image_url")
    .eq("is_available", true);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  query = query.order("name", { ascending: true }).limit(10);

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
