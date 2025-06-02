/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/menu.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type MenuItem } from "@/lib/types";

// Definisi skema validasi yang diperbarui untuk input menu
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
  image_url: z.string().url("URL gambar tidak valid.").optional().nullable(), // URL gambar opsional, bisa null
  category: z.string().min(1, "Kategori tidak boleh kosong.").default("Coffee"),
  is_available: z.boolean().default(true),
  order_index: z
    .number()
    .int()
    .min(0, "Order index tidak boleh negatif.")
    .default(0),
});

// Helper function untuk menangani upload gambar ke Supabase Storage (AKAN DITAMBAHKAN NANTI)
async function uploadImageToSupabase(
  file: File,
  supabaseClient: any
): Promise<string | null> {
  // Ini adalah placeholder. Implementasi sebenarnya akan ada di langkah selanjutnya.
  // Untuk saat ini, kita bisa mock URL atau mengembalikan null.
  // Contoh mock:
  console.log(`Simulating upload for: ${file.name}`);
  // const { data, error } = await supabaseClient.storage.from('menu-images').upload(`public/${file.name}`, file, {
  //   cacheControl: '3600',
  //   upsert: false
  // });
  // if (error) {
  //   console.error('Upload failed:', error.message);
  //   return null;
  // }
  // const { data: publicUrl } = supabaseClient.storage.from('menu-images').getPublicUrl(data.path);
  // return publicUrl?.publicUrl || null;
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Mock upload complete for ${file.name}`);
      resolve(
        `https://via.placeholder.com/600x600?text=Uploaded+${file.name.substring(
          0,
          10
        )}`
      );
    }, 1000)
  );
}

// --- CREATE MENU ---
export async function createMenuItem(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const rawImageUrl = formData.get("image_url") as string | null; // Ambil URL manual
  const imageFile = formData.get("image_file") as File | null; // Ambil file upload
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on";

  let finalImageUrl: string | null = null;
  // Logika penentuan finalImageUrl
  if (imageFile && imageFile.size > 0) {
    // Jika ada file yang diupload
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl;
    } else {
      return { success: false, message: "Gagal mengupload gambar." };
    }
  } else if (rawImageUrl) {
    // Jika ada URL manual
    finalImageUrl = rawImageUrl;
  } else {
    finalImageUrl = null; // Pastikan null jika tidak ada gambar
  }

  // Validasi input
  const validatedFields = MenuItemSchema.safeParse({
    name,
    slug,
    description: description || null,
    price,
    image_url: finalImageUrl, // Gunakan finalImageUrl setelah proses upload/penentuan
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

  // Cek apakah slug sudah ada
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

// --- UPDATE MENU ---
export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const price = parseFloat(formData.get("price") as string);
  const rawImageUrl = formData.get("image_url") as string | null;
  const imageFile = formData.get("image_file") as File | null;
  const category = formData.get("category") as string;
  const isAvailable = formData.get("is_available") === "on";

  let finalImageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    // Jika ada file baru diupload
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl;
    } else {
      return { success: false, message: "Gagal mengupload gambar baru." };
    }
  } else if (rawImageUrl) {
    // Jika tidak ada file baru, tapi ada URL manual
    finalImageUrl = rawImageUrl;
  } else {
    finalImageUrl = null; // Jika tidak ada keduanya, set null
  }

  // Validasi input
  const validatedFields = MenuItemSchema.safeParse({
    id,
    name,
    slug,
    description: description || null,
    price,
    image_url: finalImageUrl, // Gunakan finalImageUrl
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

  // Cek apakah slug sudah ada dan bukan milik item yang sedang diedit
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

// ... DELETE MENU dan TOGGLE AVAILABILITY tetap sama seperti sebelumnya ...
export async function deleteMenuItem(id: string) {
  const supabase = await createServerSupabaseClient();

  // Opsional: Hapus gambar dari Supabase Storage jika ada
  // const { data: menuItemToDelete } = await supabase.from('menus').select('image_url').eq('id', id).single();
  // if (menuItemToDelete?.image_url && menuItemToDelete.image_url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL!)) {
  //   const filePath = menuItemToDelete.image_url.split('/').pop(); // Ambil nama file dari URL
  //   if (filePath) {
  //     const { error: deleteStorageError } = await supabase.storage.from('menu-images').remove([`public/${filePath}`]);
  //     if (deleteStorageError) {
  //       console.error('Error deleting image from storage:', deleteStorageError.message);
  //     }
  //   }
  // }

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
