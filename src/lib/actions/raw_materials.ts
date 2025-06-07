// src/lib/actions/raw_materials.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type RawMaterial } from "@/lib/types";

// Skema validasi untuk Bahan Baku
const RawMaterialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Nama bahan baku tidak boleh kosong.")
    .max(100, "Nama terlalu panjang."),
  unit: z
    .string()
    .min(1, "Satuan tidak boleh kosong.")
    .max(20, "Satuan terlalu panjang."),
  current_stock: z.number().min(0, "Stok tidak boleh negatif.").default(0),
  last_purchase_price: z
    .number()
    .min(0, "Harga tidak boleh negatif.")
    .optional()
    .nullable(),
  supplier: z
    .string()
    .max(100, "Nama supplier terlalu panjang.")
    .optional()
    .nullable(),
});

// --- CREATE RAW MATERIAL ---
export async function createRawMaterial(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const unit = formData.get("unit") as string;
  const currentStock = parseFloat(formData.get("current_stock") as string);
  const lastPurchasePrice = parseFloat(
    formData.get("last_purchase_price") as string
  );
  const supplier = formData.get("supplier") as string | null;

  const validatedFields = RawMaterialSchema.safeParse({
    name,
    unit,
    current_stock: currentStock,
    last_purchase_price: isNaN(lastPurchasePrice) ? null : lastPurchasePrice,
    supplier: supplier || null,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createRawMaterial):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: newRawMaterial, error } = await supabase
    .from("raw_materials")
    .insert([validatedFields.data])
    .select()
    .single();

  if (error) {
    console.error("Error creating raw material:", error.message);
    return {
      success: false,
      message: `Gagal membuat bahan baku: ${error.message}`,
    };
  }

  revalidatePath("/mudir/raw-materials");
  return {
    success: true,
    message: `Bahan baku "${newRawMaterial.name}" berhasil ditambahkan.`,
  };
}

// --- UPDATE RAW MATERIAL ---
export async function updateRawMaterial(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const unit = formData.get("unit") as string;
  const currentStock = parseFloat(formData.get("current_stock") as string);
  const lastPurchasePrice = parseFloat(
    formData.get("last_purchase_price") as string
  );
  const supplier = formData.get("supplier") as string | null;

  const validatedFields = RawMaterialSchema.safeParse({
    id,
    name,
    unit,
    current_stock: currentStock,
    last_purchase_price: isNaN(lastPurchasePrice) ? null : lastPurchasePrice,
    supplier: supplier || null,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (updateRawMaterial):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: updatedRawMaterial, error } = await supabase
    .from("raw_materials")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating raw material:", error.message);
    return {
      success: false,
      message: `Gagal memperbarui bahan baku: ${error.message}`,
    };
  }

  revalidatePath("/mudir/raw-materials");
  revalidatePath(`/mudir/raw-materials/${id}/edit`);
  return {
    success: true,
    message: `Bahan baku "${updatedRawMaterial.name}" berhasil diperbarui.`,
  };
}

// --- DELETE RAW MATERIAL ---
export async function deleteRawMaterial(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("raw_materials").delete().eq("id", id);

  if (error) {
    console.error("Error deleting raw material:", error.message);
    return {
      success: false,
      message: `Gagal menghapus bahan baku: ${error.message}`,
    };
  }

  revalidatePath("/mudir/raw-materials");
  return { success: true, message: "Bahan baku berhasil dihapus." };
}

// --- GET RAW MATERIALS FOR SELECTOR (tetap sama) ---
export async function getRawMaterialsForSelector(search: string = "") {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("raw_materials")
    .select("id, name, unit, last_purchase_price");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  query = query.order("name", { ascending: true }).limit(10);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching raw materials for selector:", error.message);
    return { data: [], error: `Gagal memuat bahan baku: ${error.message}` };
  }
  return {
    data: data as Pick<
      RawMaterial,
      "id" | "name" | "unit" | "last_purchase_price"
    >[],
    error: null,
  };
}

// --- GET RAW MATERIAL BY ID (untuk halaman edit) ---
export async function getRawMaterialById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("raw_materials")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching raw material by ID:", error.message);
    return { data: null, error: `Gagal memuat bahan baku: ${error.message}` };
  }

  return { data: data as RawMaterial | null, error: null };
}
