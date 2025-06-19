// src/lib/actions/dashboard.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type Transaction,
  // type MenuItem,
  // type TransactionItem,
} from "@/lib/types";
import { getTransactions } from "./transactions/read";

function getDateRange(period: "daily" | "weekly" | "monthly" | "all"): {
  startDate: string | null;
  endDate: string | null;
} {
  const now = new Date();
  let startDate: Date | null = null;
  const endDate: Date = new Date();

  endDate.setHours(23, 59, 59, 999);

  if (period === "daily") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "weekly") {
    const dayOfWeek = now.getDay();
    startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    // 'all'
    startDate = null;
  }

  return {
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate.toISOString(),
  };
}

export async function getSalesSummary(
  period: "daily" | "weekly" | "monthly" | "all" = "monthly"
) {
  const supabase = await createServerSupabaseClient();

  const { startDate, endDate } = getDateRange(period);

  let query = supabase
    .from("transactions")
    .select(
      `
    total_amount,
    items:transaction_items (
        quantity
    )
  `
    )
    .eq("type", "sale");

  if (startDate) {
    query = query
      .gte("transaction_timestamp", startDate)
      .lte("transaction_timestamp", endDate);
  }

  const { data: sales, error } = await query;

  if (error) {
    console.error(`Error getting sales summary for ${period}:`, error);
    return {
      totalAmount: 0,
      totalPcs: 0,
      count: 0,
      error: `Gagal memuat ringkasan penjualan ${period}: ${error.message}`,
    };
  }

  const totalAmount = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const totalPcs = sales.reduce((sum, sale) => {
    const itemQuantities = Array.isArray(sale.items)
      ? sale.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
      : 0;
    return sum + itemQuantities;
  }, 0);

  return { totalAmount, totalPcs, count: sales.length, error: null };
}

export async function getPurchaseSummary(
  period: "daily" | "weekly" | "monthly" | "all" = "monthly"
) {
  const supabase = await createServerSupabaseClient();

  const { startDate, endDate } = getDateRange(period);

  let query = supabase
    .from("transactions")
    .select(
      `
      total_amount
    `
    )
    .eq("type", "purchase");

  if (startDate) {
    query = query
      .gte("transaction_timestamp", startDate)
      .lte("transaction_timestamp", endDate);
  }

  const { data: purchases, error } = await query;

  if (error) {
    console.error(`Error getting purchase summary for ${period}:`, error);
    return {
      totalAmount: 0,
      count: 0,
      error: `Gagal memuat ringkasan pembelian ${period}: ${error.message}`,
    };
  }

  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + purchase.total_amount,
    0
  );

  return { totalAmount, count: purchases.length, error: null };
}

// --- GET MENU AND CAROUSEL COUNTS ---
export async function getMenuAndCarouselCounts() {
  const supabase = await createServerSupabaseClient();
  let menuCount = 0;
  let carouselCount = 0;
  const promoCount = 0;
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

    // Untuk promo jika sudah ada
    // const { count: fetchedPromoCount, error: promoError } = await supabase
    //   .from('promos')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('is_active', true);
    // if (promoError) throw promoError;
    // promoCount = fetchedPromoCount || 0;
  } catch (err: any) {
    console.error("Error fetching dashboard counts:", err.message);
    error = `Gagal memuat jumlah data: ${err.message}`;
  }

  return { menuCount, carouselCount, promoCount, error };
}

export async function getRecentSalesTransactions(limit: number = 5) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await getTransactions({ type: "sale" });

  if (error) {
    console.error("Error getting recent sales transactions:", error);
    return { data: [], error: `Gagal memuat transaksi terbaru: ${error}` };
  }

  const recentSales = data.slice(0, limit);

  return { data: recentSales, error: null };
}

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
    .eq("transaction.type", "sale");

  if (period === "monthly") {
    const { startDate, endDate } = getDateRange(period);
    if (startDate) {
      query = query
        .gte("transaction.transaction_timestamp", startDate)
        .lte("transaction.transaction_timestamp", endDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error getting top selling menus:", error.message);
    return { data: [], error: `Gagal memuat menu terlaris: ${error.message}` };
  }

  const aggregatedSales: {
    [menuItemId: string]: {
      name: string;
      imageUrl: string | null;
      totalQuantity: number;
      totalRevenue: number;
    };
  } = {};

  (data as any[]).forEach((item) => {
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
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);

  return { data: sortedTopMenus, error: null };
}

export async function getTopSpendingItems(
  limit: number = 3,
  period: "monthly" | "all" = "monthly"
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("transactions")
    .select(
      `
            id,
            total_amount,
            purchase_items_json,
            transaction_timestamp
        `
    )
    .eq("type", "purchase");

  if (period === "monthly") {
    const { startDate, endDate } = getDateRange(period);
    if (startDate) {
      query = query
        .gte("transaction_timestamp", startDate)
        .lte("transaction_timestamp", endDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error getting top spending items:", error.message);
    return {
      data: [],
      error: `Gagal memuat item pengeluaran teratas: ${error.message}`,
    };
  }

  const aggregatedPurchases: {
    [itemName: string]: {
      name: string;
      totalQuantity: number;
      totalCost: number;
    };
  } = {};

  (data as Transaction[]).forEach((transaction) => {
    if (
      transaction.purchase_items_json &&
      Array.isArray(transaction.purchase_items_json)
    ) {
      transaction.purchase_items_json.forEach((item) => {
        const itemName = item.raw_material_name;
        const quantity = item.quantity;
        const unitPrice = item.unit_price;

        if (!aggregatedPurchases[itemName]) {
          aggregatedPurchases[itemName] = {
            name: itemName,
            totalQuantity: 0,
            totalCost: 0,
          };
        }
        aggregatedPurchases[itemName].totalQuantity += quantity;
        aggregatedPurchases[itemName].totalCost += quantity * unitPrice;
      });
    }
  });

  const sortedTopItems = Object.values(aggregatedPurchases)
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, limit);

  return { data: sortedTopItems, error: null };
}
