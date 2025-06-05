/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/transactions/purchases.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type Transaction, type TransactionItem } from "@/lib/types"; // Mungkin nanti ada PurchaseItem

// Skema untuk item pembelian (lebih sederhana dari item penjualan)
const PurchaseItemInputSchema = z.object({
  description: z.string().min(1, "Deskripsi item tidak boleh kosong."),
  quantity: z.number().int().min(1, "Kuantitas harus minimal 1."),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif."),
});

// Skema untuk transaksi pembelian
const PurchaseTransactionSchema = z.object({
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
  platform_source: z.string().min(1, "Sumber pembelian tidak boleh kosong."),
  notes: z.string().max(500, "Catatan terlalu panjang.").optional().nullable(),
  // Kolom customer terkait penjualan tidak relevan di sini, bisa nullable
  customer_name: z.string().optional().nullable(),
  customer_phone: z.string().optional().nullable(),
  customer_ig_username: z.string().optional().nullable(),
  customer_food_delivery_id: z.string().optional().nullable(),
  delivery_city: z.string().optional().nullable(),
  delivery_district: z.string().optional().nullable(),
  is_delivery: z.boolean().default(false), // Bisa jadi pembelian diantar
  is_pickup: z.boolean().default(false), // Bisa jadi pembelian diambil
  screenshot_url: z
    .string()
    .url("URL bukti pembelian tidak valid.")
    .or(z.literal(""))
    .optional()
    .nullable(),

  // Tipe transaksi ini adalah 'purchase'
  type: z.literal("purchase").default("purchase"),
  // Status pembelian (misal, 'paid', 'pending', 'received')
  status: z.string().default("paid"),

  // Item pembelian, bisa sebagai JSON string
  items: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Setidaknya harus ada satu item pembelian.",
          path: ["items"],
        });
        return z.NEVER;
      }
      const validated = z.array(PurchaseItemInputSchema).parse(parsed);
      return validated;
    } catch (e: any) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format item pembelian tidak valid.",
        path: ["items"],
      });
      return z.NEVER;
    }
  }),
});

// --- CREATE PURCHASE TRANSACTION ---
export async function createPurchaseTransaction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const timestampStr = formData.get("transaction_timestamp") as string;
  const totalAmount = parseFloat(formData.get("total_amount") as string);
  const platformSource = formData.get("platform_source") as string; // Di sini jadi sumber pembelian
  const notes = formData.get("notes") as string | null;
  const screenshotUrl = formData.get("screenshot_url") as string | null;
  const itemsJson = formData.get("items") as string; // Items sebagai JSON string

  const validatedFields = PurchaseTransactionSchema.safeParse({
    transaction_timestamp: timestampStr,
    total_amount: totalAmount,
    platform_source: platformSource,
    notes: notes || null,
    screenshot_url: screenshotUrl || null,
    items: itemsJson,
    type: "purchase", // Pastikan type-nya 'purchase'
    status: "paid", // Default status
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createPurchaseTransaction):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const calculatedTotal = validatedFields.data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  if (Math.abs(calculatedTotal - validatedFields.data.total_amount) > 0.01) {
    return {
      success: false,
      message: "Total pembelian tidak cocok dengan penjumlahan item.",
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
      "Error creating purchase transaction:",
      transactionError.message
    );
    return {
      success: false,
      message: `Gagal membuat transaksi pembelian: ${transactionError.message}`,
    };
  }

  // Masukkan item pembelian ke tabel yang sama (transaction_items) atau tabel baru (purchase_items)?
  // Jika ke transaction_items:
  // Catatan: menu_item_id di transaction_items jadi nullable atau pakai dummy ID jika tidak ada
  // Atau kita buat tabel baru untuk purchase_items. Untuk menjaga sederhana, pakai tabel yang sama dulu.
  // Untuk ini, Anda perlu membuat `menu_item_id` di `transaction_items` menjadi nullable di Supabase.
  // ATAU, jika `transaction_items` hanya untuk penjualan menu, maka kita perlu tabel baru `purchase_items`.
  // Untuk saat ini, asumsikan `transaction_items` hanya untuk penjualan menu.
  // Saya akan anggap `items` di `PurchaseTransactionSchema` adalah data deskriptif yang tidak masuk ke `transaction_items`
  // tapi ke `notes` atau kolom lain di `transactions` itu sendiri atau tabel `purchase_items` baru.
  // Agar lebih fleksibel, mari kita buat `items` untuk pembelian sebagai JSONB di kolom `purchase_details_json` di `transactions` saja.

  // Re-define schema for PurchaseTransactionSchema to store items as JSONB in a column
  const FinalPurchaseTransactionSchema = PurchaseTransactionSchema.omit({
    items: true,
  }).extend({
    purchase_items_json: z.array(PurchaseItemInputSchema).optional().nullable(),
  });

  const finalValidatedPurchaseData = FinalPurchaseTransactionSchema.safeParse({
    ...transactionData,
    purchase_items_json: items, // Ambil items yang sudah divalidasi
  });

  if (!finalValidatedPurchaseData.success) {
    console.error(
      "Final validation error for purchase:",
      finalValidatedPurchaseData.error.flatten().fieldErrors
    );
    return { success: false, message: "Gagal memfinalisasi data pembelian." };
  }

  // Lanjutkan insert ke `transactions` dengan `purchase_items_json`
  const { data: newPurchaseTransaction, error: finalTransactionError } =
    await supabase
      .from("transactions")
      .update(finalValidatedPurchaseData.data) // Update baris yang baru dibuat
      .eq("id", newTransaction.id)
      .select()
      .single();

  if (finalTransactionError) {
    console.error(
      "Error updating purchase transaction with items:",
      finalTransactionError.message
    );
    return {
      success: false,
      message: `Gagal melengkapi transaksi pembelian: ${finalTransactionError.message}`,
    };
  }

  revalidatePath("/mudir/transactions");
  revalidatePath("/mudir");
  // revalidatePath('/mudir/purchases'); // Jika nanti ada halaman purchases terpisah
  return { success: true, message: "Transaksi pembelian berhasil dicatat!" };
}

// --- UPDATE PURCHASE TRANSACTION (placeholder, jika nanti ada) ---
export async function updatePurchaseTransaction(
  id: string,
  formData: FormData
) {
  return {
    success: false,
    message: "Fitur update transaksi pembelian belum diimplementasikan.",
  };
}

// --- DELETE PURCHASE TRANSACTION (placeholder, jika nanti ada) ---
export async function deletePurchaseTransaction(id: string) {
  return {
    success: false,
    message: "Fitur hapus transaksi pembelian belum diimplementasikan.",
  };
}
