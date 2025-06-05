/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/dashboard.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type Transaction,
  type MenuItem,
  type TransactionItem,
} from "@/lib/types";
import { getTransactions } from "./transactions/read"; // Import getTransactions dari read.ts

// --- GET TOTAL SALES SUMMARY (Per Periode) ---
export async function getTotalSalesSummary(
  period: "daily" | "weekly" | "monthly" | "all" = "monthly"
) {
  const supabase = await createServerSupabaseClient();

  // Menggunakan fungsi getTransactions yang sudah ada dengan filter type='sale'
  const { data: sales, error } = await getTransactions({
    period,
    type: "sale",
  });

  if (error) {
    console.error("Error getting total sales summary:", error);
    return {
      totalAmount: 0,
      count: 0,
      error: `Gagal memuat ringkasan penjualan: ${error}`,
    };
  }

  const totalAmount = sales.reduce((sum, sale) => sum + sale.total_amount, 0);

  return { totalAmount, count: sales.length, error: null };
}

// --- GET MENU AND CAROUSEL COUNTS ---
export async function getMenuAndCarouselCounts() {
  const supabase = await createServerSupabaseClient();
  let menuCount = 0;
  let carouselCount = 0;
  let error: string | null = null;

  try {
    const { count: fetchedMenuCount, error: menuError } = await supabase
      .from("menus")
      .select("*", { count: "exact", head: true })
      .eq("is_available", true);

    if (menuError) throw menuError;
    menuCount = fetchedMenuCount || 0;

    const { count: fetchedCarouselCount, error: carouselError } = await supabase
      .from("carousel_slides")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (carouselError) throw carouselError;
    carouselCount = fetchedCarouselCount || 0;
  } catch (err: any) {
    console.error("Error fetching dashboard counts:", err.message);
    error = `Gagal memuat jumlah data: ${err.message}`;
  }

  return { menuCount, carouselCount, error };
}

// --- GET RECENT SALES TRANSACTIONS ---
export async function getRecentSalesTransactions(limit: number = 5) {
  const supabase = await createServerSupabaseClient();

  // Menggunakan fungsi getTransactions dengan filter type='sale' dan limit
  const { data, error } = await getTransactions({ type: "sale" }); // getTransactions already orders by timestamp desc

  if (error) {
    console.error("Error getting recent sales transactions:", error);
    return { data: [], error: `Gagal memuat transaksi terbaru: ${error}` };
  }

  // Karena getTransactions mengambil semua dan filter, kita potong di sini
  // Ini bisa dioptimalkan dengan menambahkan limit ke getTransactions jika diperlukan
  const recentSales = data.slice(0, limit);

  return { data: recentSales, error: null };
}

// --- GET TOP SELLING MENUS (Complex Query) ---
// Ini membutuhkan join dan agregasi di Supabase
export async function getTopSellingMenus(
  limit: number = 5,
  period: "monthly" | "all" = "monthly"
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("transaction_items")
    .select(
      `
      menu_item_id,
      quantity,
      price_at_transaction,
      menu_item:menus (
        name,
        image_url
      ),
      transaction:transactions (
        transaction_timestamp,
        type
      )
    `
    )
    .eq("transaction.type", "sale"); // Hanya item penjualan

  if (period === "monthly") {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ).toISOString();
    query = query
      .gte("transaction.transaction_timestamp", startOfMonth)
      .lte("transaction.transaction_timestamp", endOfMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error getting top selling menus:", error.message);
    return { data: [], error: `Gagal memuat menu terlaris: ${error.message}` };
  }

  // Agregasi data di sisi aplikasi (jika tidak bisa dilakukan di Supabase langsung dengan Postgrest)
  const aggregatedSales: {
    [menuItemId: string]: {
      name: string;
      imageUrl: string | null;
      totalQuantity: number;
      totalRevenue: number;
    };
  } = {};

  (data as any[]).forEach((item) => {
    // Cast to any[] for simpler access
    const menuItemId = item.menu_item_id;
    const quantity = item.quantity;
    const price = item.price_at_transaction;
    const name = item.menu_item?.name || "Unknown Menu";
    const imageUrl = item.menu_item?.image_url || null;

    if (!aggregatedSales[menuItemId]) {
      aggregatedSales[menuItemId] = {
        name,
        imageUrl,
        totalQuantity: 0,
        totalRevenue: 0,
      };
    }
    aggregatedSales[menuItemId].totalQuantity += quantity;
    aggregatedSales[menuItemId].totalRevenue += quantity * price;
  });

  const sortedTopMenus = Object.values(aggregatedSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity) // Urutkan berdasarkan kuantitas terjual
    .slice(0, limit); // Ambil limit

  return { data: sortedTopMenus, error: null };
}
