/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/transaction.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { MenuItem, type Transaction, type TransactionItem } from "@/lib/types";

const TransactionItemInputSchema = z.object({
  menu_item_id: z.string().uuid("ID Menu tidak valid."),
  quantity: z.number().int().min(1, "Kuantitas harus minimal 1."),
  price_at_transaction: z.number().min(0, "Harga tidak boleh negatif."),
});

// Skema untuk seluruh transaksi yang dikirim dari form
const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  transaction_timestamp: z
    .string()
    .datetime({ message: "Timestamp transaksi tidak valid." }),
  total_amount: z.number().min(0, "Total jumlah tidak boleh negatif."),
  platform_source: z.string().min(1, "Sumber platform tidak boleh kosong."),
  notes: z.string().max(500, "Catatan terlalu panjang.").optional().nullable(),
  customer_name: z
    .string()
    .max(100, "Nama pelanggan terlalu panjang.")
    .optional()
    .nullable(),
  customer_phone: z
    .string()
    .max(20, "Nomor telepon terlalu panjang.")
    .optional()
    .nullable(),
  customer_ig_username: z
    .string()
    .max(50, "Username IG terlalu panjang.")
    .optional()
    .nullable(),
  customer_food_delivery_id: z
    .string()
    .max(50, "ID Food Delivery terlalu panjang.")
    .optional()
    .nullable(),
  delivery_city: z
    .string()
    .max(100, "Nama kota terlalu panjang.")
    .optional()
    .nullable(),
  delivery_district: z
    .string()
    .max(100, "Nama kecamatan terlalu panjang.")
    .optional()
    .nullable(),
  is_delivery: z.boolean().default(false),
  is_pickup: z.boolean().default(false),
  screenshot_url: z
    .string()
    .url("URL screenshot tidak valid.")
    .or(z.literal(""))
    .optional()
    .nullable(),

  // Items akan dikirim sebagai array JSON string dari Client Component
  items: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      const validated = z.array(TransactionItemInputSchema).parse(parsed);
      return validated;
    } catch (e: any) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format item transaksi tidak valid.",
        path: ["items"],
      });
      return z.NEVER;
    }
  }),
});

// --- CREATE TRANSACTION ---
export async function createTransaction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const timestampStr = formData.get("transaction_timestamp") as string;
  const totalAmount = parseFloat(formData.get("total_amount") as string);
  const platformSource = formData.get("platform_source") as string;
  const notes = formData.get("notes") as string | null;
  const customerName = formData.get("customer_name") as string | null;
  const customerPhone = formData.get("customer_phone") as string | null;
  const customerIgUsername = formData.get("customer_ig_username") as
    | string
    | null;
  const customerFoodDeliveryId = formData.get("customer_food_delivery_id") as
    | string
    | null;
  const deliveryCity = formData.get("delivery_city") as string | null;
  const deliveryDistrict = formData.get("delivery_district") as string | null;
  const isDelivery = formData.get("is_delivery") === "on";
  const isPickup = formData.get("is_pickup") === "on";
  const screenshotUrl = formData.get("screenshot_url") as string | null;
  const itemsJson = formData.get("items") as string; // Items sebagai JSON string

  const validatedFields = TransactionSchema.safeParse({
    transaction_timestamp: timestampStr,
    total_amount: totalAmount,
    platform_source: platformSource,
    notes: notes || null,
    customer_name: customerName || null,
    customer_phone: customerPhone || null,
    customer_ig_username: customerIgUsername || null,
    customer_food_delivery_id: customerFoodDeliveryId || null,
    delivery_city: deliveryCity || null,
    delivery_district: deliveryDistrict || null,
    is_delivery: isDelivery,
    is_pickup: isPickup,
    screenshot_url: screenshotUrl || null,
    items: itemsJson,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createTransaction):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { items, ...transactionData } = validatedFields.data;

  // Mulai transaksi database untuk memastikan konsistensi
  const { data: newTransaction, error: transactionError } = await supabase
    .from("transactions")
    .insert([transactionData])
    .select("id")
    .single();

  if (transactionError) {
    console.error("Error creating transaction:", transactionError.message);
    return {
      success: false,
      message: `Gagal membuat transaksi: ${transactionError.message}`,
    };
  }

  // Masukkan item transaksi
  const transactionItemsToInsert = items.map((item) => ({
    ...item,
    transaction_id: newTransaction.id,
  }));

  const { error: itemsError } = await supabase
    .from("transaction_items")
    .insert(transactionItemsToInsert);

  if (itemsError) {
    console.error("Error creating transaction items:", itemsError.message);
    // Rollback transaksi utama jika item gagal dimasukkan (perlu advanced Supabase function/trigger)
    // Untuk saat ini, asumsikan ini akan sukses atau admin perlu hapus manual
    return {
      success: false,
      message: `Transaksi berhasil dibuat, tetapi gagal memasukkan item: ${itemsError.message}`,
    };
  }

  revalidatePath("/mudir/transactions");
  revalidatePath("/mudir"); // Update dashboard
  return { success: true, message: "Transaksi berhasil dicatat!" };
}

// --- GET TRANSACTIONS (dengan filter, untuk halaman daftar) ---
export async function getTransactions(
  filters: {
    period?: "daily" | "weekly" | "monthly" | "all";
    platformSource?: string;
    search?: string; // Pencarian nama/id pelanggan
    startDate?: string;
    endDate?: string;
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
    customer_food_delivery_id
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

  if (filters.platformSource && filters.platformSource !== "All") {
    query = query.eq("platform_source", filters.platformSource);
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
