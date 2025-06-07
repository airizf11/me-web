// src/lib/actions/menu.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  createServerSupabaseClientReadOnly,
} from "@/lib/supabase/server";
import { z } from "zod";
import { type MenuItem } from "@/lib/types";

const MenuItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Nama menu tidak boleh kosong.")
    .max(100, "Nama menu terlalu panjang."),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong.")
    .max(120, "Slug terlalu panjang."),
  description: z
    .string()
    .max(255, "Deskripsi terlalu panjang.")
    .optional()
    .nullable(),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  image_url: z
    .string()
    .url("URL gambar tidak valid.")
    .or(z.literal(""))
    .optional()
    .nullable(),
  category: z.string().min(1, "Kategori tidak boleh kosong.").default("Coffee"),
  is_available: z.boolean().default(true),
  order_index: z
    .number()
    .int()
    .min(0, "Order index harus berupa bilangan bulat positif.")
    .default(0),
  additional_images: z
    .array(z.string().url("URL gambar tambahan tidak valid."))
    .optional()
    .nullable(),
});

export async function createMenuItem(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on";
  const imageUrl = formData.get("image_url") as string | null;
  const orderIndex = parseInt(formData.get("order_index") as string);
  const additionalImagesJson = formData.get("additional_images") as
    | string
    | null;
  let additionalImages: string[] | null = null;
  if (additionalImagesJson) {
    try {
      const parsedImages = JSON.parse(additionalImagesJson);
      if (
        Array.isArray(parsedImages) &&
        parsedImages.every((img) => typeof img === "string")
      ) {
        additionalImages = parsedImages;
      }
    } catch (e) {
      console.error("Failed to parse additional_images JSON:", e);
    }
  }

  const validatedFields = MenuItemSchema.safeParse({
    name,
    slug,
    description: description || null,
    price,
    image_url: imageUrl || null,
    category,
    is_available: isAvailable,
    order_index: orderIndex,
    additional_images: additionalImages || null,
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

  const { data: existingSlug, error: slugCheckError } = await supabase
    .from("menus")
    .select("id")
    .eq("slug", validatedFields.data.slug)
    .single();

  if (existingSlug) {
    return {
      success: false,
      message: `Slug "${validatedFields.data.slug}" sudah digunakan. Silakan gunakan slug lain.`,
    };
  }
  if (slugCheckError && slugCheckError.code !== "PGRST116") {
    console.error("Error checking slug:", slugCheckError.message);
    return {
      success: false,
      message: `Gagal memeriksa slug: ${slugCheckError.message}`,
    };
  }

  const { data: newMenuItem, error } = await supabase
    .from("menus")
    .insert([validatedFields.data])
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error.message);
    return { success: false, message: `Gagal membuat menu: ${error.message}` };
  }

  revalidatePath("/mudir/menus");
  return {
    success: true,
    message: `Menu "${newMenuItem.name}" berhasil ditambahkan.`,
  };
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on";
  const imageUrl = formData.get("image_url") as string | null;
  const orderIndex = parseInt(formData.get("order_index") as string);
  const additionalImagesJson = formData.get("additional_images") as
    | string
    | null;
  let additionalImages: string[] | null = null;
  if (additionalImagesJson) {
    try {
      const parsedImages = JSON.parse(additionalImagesJson);
      if (
        Array.isArray(parsedImages) &&
        parsedImages.every((img) => typeof img === "string")
      ) {
        additionalImages = parsedImages;
      }
    } catch (e) {
      console.error("Failed to parse additional_images JSON for update:", e);
    }
  }

  const validatedFields = MenuItemSchema.safeParse({
    id,
    name,
    slug,
    description: description || null,
    price,
    image_url: imageUrl || null,
    category,
    is_available: isAvailable,
    order_index: orderIndex,
    additional_images: additionalImages || null,
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

  const { data: existingSlug, error: slugCheckError } = await supabase
    .from("menus")
    .select("id")
    .eq("slug", validatedFields.data.slug)
    .neq("id", id)
    .single();

  if (existingSlug) {
    return {
      success: false,
      message: `Slug "${validatedFields.data.slug}" sudah digunakan oleh menu lain. Silakan gunakan slug lain.`,
    };
  }
  if (slugCheckError && slugCheckError.code !== "PGRST116") {
    console.error("Error checking slug:", slugCheckError.message);
    return {
      success: false,
      message: `Gagal memeriksa slug: ${slugCheckError.message}`,
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
  revalidatePath(`/mudir/menus/${id}/edit`);
  return {
    success: true,
    message: `Menu "${updatedMenuItem.name}" berhasil diperbarui.`,
  };
}

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

export async function getMenuItemBySlug(slug: string) {
  const supabase = await createServerSupabaseClientReadOnly();
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("slug", slug)
    .eq("is_available", true)
    .single();

  if (error) {
    console.error(`Error fetching menu by slug ${slug}:`, error.message);
    return { data: null, error: `Menu tidak ditemukan atau tidak tersedia.` };
  }
  return { data: data as MenuItem, error: null };
}

export async function getAllCategories() {
  const supabase = await createServerSupabaseClientReadOnly();
  const { data, error } = await supabase
    .from("menus")
    .select("category, count")
    .eq("is_available", true)
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error.message);
    return { data: [], error: `Gagal memuat kategori.` };
  }

  return { data: data as { category: string; count: number }[], error: null };
}

export async function getMenusByCategory(category: string | "all") {
  const supabase = await createServerSupabaseClientReadOnly();
  let query = supabase
    .from("menus")
    .select("*")
    .eq("is_available", true)
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      `Error fetching menus for category ${category}:`,
      error.message
    );
    return { data: [], error: `Gagal memuat menu untuk kategori ini.` };
  }

  return { data: data as MenuItem[], error: null };
}
