/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/transactions/sales.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import {
  type Transaction,
  type TransactionItem,
  type MenuItem,
} from "@/lib/types";

// Skema untuk item dalam transaksi yang dikirim dari form (Client Component)
const TransactionItemInputSchema = z.object({
  menu_item_id: z.string().uuid("ID Menu tidak valid."),
  quantity: z.number().int().min(1, "Kuantitas harus minimal 1."),
  price_at_transaction: z.number().min(0, "Harga tidak boleh negatif."),
});

// Skema untuk transaksi penjualan
const SalesTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  transaction_timestamp: z
    .string()
    .min(1, "Waktu transaksi tidak boleh kosong.")
    .transform((str, ctx) => {
      const parsedDate = new Date(str);
      if (isNaN(parsedDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Format waktu transaksi tidak valid. Contoh: YYYY-MM-DDTHH:MM",
          path: ["transaction_timestamp"],
        });
        return z.NEVER;
      }
      return str;
    }),
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

  // Tipe transaksi ini adalah 'sale'
  type: z.literal("sale").default("sale"),
  // Status transaksi sale (misal, 'completed')
  status: z.string().default("completed"),

  items: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Setidaknya harus ada satu item transaksi.",
          path: ["items"],
        });
        return z.NEVER;
      }
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

// --- CREATE SALES TRANSACTION ---
export async function createSalesTransaction(formData: FormData) {
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
  const itemsJson = formData.get("items") as string;

  const validatedFields = SalesTransactionSchema.safeParse({
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
    type: "sale", // Pastikan type-nya 'sale'
    status: "completed", // Default status
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createSalesTransaction):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const calculatedTotal = validatedFields.data.items.reduce(
    (sum, item) => sum + item.quantity * item.price_at_transaction,
    0
  );
  if (Math.abs(calculatedTotal - validatedFields.data.total_amount) > 0.01) {
    return {
      success: false,
      message: "Total transaksi tidak cocok dengan penjumlahan item.",
    };
  }

  const { items, ...transactionData } = validatedFields.data;

  const { data: newTransaction, error: transactionError } = await supabase
    .from("transactions")
    .insert([transactionData])
    .select("id")
    .single();

  if (transactionError) {
    console.error(
      "Error creating sales transaction:",
      transactionError.message
    );
    return {
      success: false,
      message: `Gagal membuat transaksi penjualan: ${transactionError.message}`,
    };
  }

  const transactionItemsToInsert = items.map((item) => ({
    ...item,
    transaction_id: newTransaction.id,
  }));

  const { error: itemsError } = await supabase
    .from("transaction_items")
    .insert(transactionItemsToInsert);

  if (itemsError) {
    console.error(
      "Error creating sales transaction items:",
      itemsError.message
    );
    return {
      success: false,
      message: `Transaksi penjualan berhasil dibuat, tetapi gagal memasukkan item: ${itemsError.message}. Hubungi pengembang untuk perbaikan data.`,
    };
  }

  revalidatePath("/mudir/transactions"); // Revalidasi halaman daftar transaksi umum
  revalidatePath("/mudir"); // Update dashboard
  return { success: true, message: "Transaksi penjualan berhasil dicatat!" };
}

// --- UPDATE SALES TRANSACTION (placeholder, jika nanti ada) ---
export async function updateSalesTransaction(id: string, formData: FormData) {
  // Implementasi mirip create, tapi pakai .update().eq('id', id)
  return {
    success: false,
    message: "Fitur update transaksi penjualan belum diimplementasikan.",
  };
}

// --- DELETE SALES TRANSACTION (placeholder, jika nanti ada) ---
export async function deleteSalesTransaction(id: string) {
  // Implementasi delete transaksi dan itemnya
  return {
    success: false,
    message: "Fitur hapus transaksi penjualan belum diimplementasikan.",
  };
}
