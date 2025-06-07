/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/transactions/purchases.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type Transaction, type PurchaseItem } from "@/lib/types";

// PENTING: Skema untuk item pembelian yang lebih fleksibel
const PurchaseItemInputSchema = z.object({
  id: z.string().optional(), // ID lokal dari UI
  type: z.enum(["raw_material", "custom"]), // Tipe item
  raw_material_id: z.string().uuid("ID Bahan Baku tidak valid.").optional(), // Hanya jika type='raw_material'
  raw_material_name: z.string().min(1, "Nama item tidak boleh kosong."),
  quantity: z.number().int().min(1, "Kuantitas harus minimal 1."),
  unit: z
    .string()
    .min(1, "Satuan tidak boleh kosong.")
    .max(20, "Satuan terlalu panjang."),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif."),
  // Subtotal tidak perlu divalidasi di sini karena dihitung di client/server
  purchase_category_custom: z.string().optional().nullable(), // Jika ada kategori kustom
  description_custom: z.string().optional().nullable(), // Jika ada deskripsi kustom
});

// Skema untuk transaksi pembelian (tetap sama)
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
  screenshot_url: z
    .string()
    .url("URL bukti pembelian tidak valid.")
    .or(z.literal(""))
    .optional()
    .nullable(),

  type: z.literal("purchase").default("purchase"),
  status: z.string().default("paid"),

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
  const platformSource = formData.get("platform_source") as string;
  const notes = formData.get("notes") as string | null;
  const screenshotUrl = formData.get("screenshot_url") as string | null;
  const itemsJson = formData.get("items") as string;

  const validatedFields = PurchaseTransactionSchema.safeParse({
    transaction_timestamp: timestampStr,
    total_amount: totalAmount,
    platform_source: platformSource,
    notes: notes || null,
    screenshot_url: screenshotUrl || null,
    items: itemsJson,
    type: "purchase",
    status: "paid",
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
    .insert([
      {
        ...transactionData,
        purchase_items_json: items, // Simpan item sebagai JSONB
      },
    ])
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

  revalidatePath("/mudir/transactions");
  revalidatePath("/mudir/purchases");
  revalidatePath("/mudir");
  return { success: true, message: "Transaksi pembelian berhasil dicatat!" };
}

// --- UPDATE PURCHASE TRANSACTION ---
export async function updatePurchaseTransaction(
  id: string,
  formData: FormData
) {
  const supabase = await createServerSupabaseClient();

  const timestampStr = formData.get("transaction_timestamp") as string;
  const totalAmount = parseFloat(formData.get("total_amount") as string);
  const platformSource = formData.get("platform_source") as string;
  const notes = formData.get("notes") as string | null;
  const screenshotUrl = formData.get("screenshot_url") as string | null;
  const itemsJson = formData.get("items") as string;

  const validatedFields = PurchaseTransactionSchema.safeParse({
    id, // Sertakan ID untuk validasi
    transaction_timestamp: timestampStr,
    total_amount: totalAmount,
    platform_source: platformSource,
    notes: notes || null,
    screenshot_url: screenshotUrl || null,
    items: itemsJson,
    type: "purchase",
    status: "paid",
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (updatePurchaseTransaction):",
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

  const { data: updatedTransaction, error: transactionError } = await supabase
    .from("transactions")
    .update({
      ...transactionData,
      purchase_items_json: items,
    })
    .eq("id", id)
    .select()
    .single();

  if (transactionError) {
    console.error(
      "Error updating purchase transaction:",
      transactionError.message
    );
    return {
      success: false,
      message: `Gagal memperbarui transaksi pembelian: ${transactionError.message}`,
    };
  }

  revalidatePath("/mudir/transactions");
  revalidatePath("/mudir/purchases");
  revalidatePath("/mudir");
  return {
    success: true,
    message: `Transaksi pembelian ${updatedTransaction.id.substring(
      0,
      8
    )}... berhasil diperbarui!`,
  };
}

// --- DELETE PURCHASE TRANSACTION ---
export async function deletePurchaseTransaction(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("type", "purchase");

  if (error) {
    console.error("Error deleting purchase transaction:", error.message);
    return {
      success: false,
      message: `Gagal menghapus transaksi pembelian: ${error.message}`,
    };
  }

  revalidatePath("/mudir/transactions");
  revalidatePath("/mudir/purchases");
  revalidatePath("/mudir");
  return { success: true, message: "Transaksi pembelian berhasil dihapus." };
}
