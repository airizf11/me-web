/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/menu.ts
"use server"; // Deklarasi sebagai Server Action

import { revalidatePath } from "next/cache"; // Untuk merevalidasi cache Next.js
import { redirect } from "next/navigation"; // Untuk redirect (opsional, jika perlu setelah aksi)
import { createServerSupabaseClient } from "@/lib/supabase/server"; // Supabase client server
import { z } from "zod"; // Untuk validasi skema
import { type MenuItem } from "@/lib/types"; // Import tipe MenuItem

const MenuItemSchema = z.object({
  id: z.string().uuid().optional(), // ID opsional untuk mode edit
  name: z
    .string()
    .min(1, "Nama menu tidak boleh kosong.")
    .max(100, "Nama menu terlalu panjang."),
  description: z
    .string()
    .max(255, "Deskripsi terlalu panjang.")
    .optional()
    .nullable(),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  image_url: z.string().url("URL gambar tidak valid.").optional().nullable(), // URL gambar opsional
  category: z.string().min(1, "Kategori tidak boleh kosong.").default("Coffee"), // Default 'Coffee'
  is_available: z.boolean().default(true),
  order_index: z
    .number()
    .int()
    .min(0, "Order index tidak boleh negatif.")
    .default(0),
});

// --- CREATE MENU ---
export async function createMenuItem(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  // Ambil data dari FormData
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("image_url") as string | null;
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on"; // Checkbox value

  // Validasi input
  const validatedFields = MenuItemSchema.safeParse({
    name,
    description: description || null, // Pastikan null jika kosong
    price,
    image_url: imageUrl || null, // Pastikan null jika kosong
    category,
    is_available: isAvailable,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createMenuItem):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: newMenuItem, error } = await supabase
    .from("menus")
    .insert([validatedFields.data])
    .select() // Mengembalikan data yang baru dibuat
    .single();

  if (error) {
    console.error("Error creating menu item:", error.message);
    return { success: false, message: `Gagal membuat menu: ${error.message}` };
  }

  // Penting: Revalidasi path agar data di halaman manajemen menu terupdate
  revalidatePath("/mudir/menus");
  return {
    success: true,
    message: `Menu "${newMenuItem.name}" berhasil ditambahkan.`,
  };
}

// --- UPDATE MENU ---
export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  // Ambil data dari FormData
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("image_url") as string | null;
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on";

  // Validasi input
  const validatedFields = MenuItemSchema.safeParse({
    id, // Sertakan ID untuk validasi (jika diperlukan)
    name,
    description: description || null,
    price,
    image_url: imageUrl || null,
    category,
    is_available: isAvailable,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (updateMenuItem):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: updatedMenuItem, error } = await supabase
    .from("menus")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error.message);
    return {
      success: false,
      message: `Gagal memperbarui menu: ${error.message}`,
    };
  }

  revalidatePath("/mudir/menus");
  return {
    success: true,
    message: `Menu "${updatedMenuItem.name}" berhasil diperbarui.`,
  };
}

// --- DELETE MENU ---
export async function deleteMenuItem(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("menus").delete().eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error.message);
    return {
      success: false,
      message: `Gagal menghapus menu: ${error.message}`,
    };
  }

  revalidatePath("/mudir/menus");
  return { success: true, message: "Menu berhasil dihapus." };
}

// --- TOGGLE AVAILABILITY ---
export async function toggleMenuItemAvailability(
  id: string,
  currentStatus: boolean
) {
  const supabase = await createServerSupabaseClient();

  const { data: updatedItem, error } = await supabase
    .from("menus")
    .update({ is_available: !currentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling availability:", error.message);
    return {
      success: false,
      message: `Gagal mengubah status ketersediaan: ${error.message}`,
    };
  }

  revalidatePath("/mudir/menus");
  return {
    success: true,
    message: `Status ketersediaan menu "${updatedItem.name}" berhasil diubah.`,
  };
}
