/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/actions/carousel.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type CarouselSlide } from "@/lib/types";

const CarouselSlideSchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z
    .string()
    .url("URL gambar tidak valid.")
    .or(z.literal(""))
    .nullable(),
  alt_text: z
    .string()
    .min(1, "Alt text tidak boleh kosong.")
    .max(255, "Alt text terlalu panjang."),
  headline: z
    .string()
    .min(1, "Headline tidak boleh kosong.")
    .max(100, "Headline terlalu panjang."),
  body_text: z
    .string()
    .max(500, "Body text terlalu panjang.")
    .optional()
    .nullable(),
  button_text: z
    .string()
    .max(50, "Teks tombol terlalu panjang.")
    .optional()
    .nullable(),
  button_link: z
    .string()
    .url("Link tombol tidak valid.")
    .or(z.literal(""))
    .optional()
    .nullable(),
  order_index: z
    .number()
    .int()
    .min(0, "Order index harus berupa bilangan bulat positif.")
    .default(0),
  is_active: z.boolean().default(true),
});

async function uploadImageToSupabase(
  file: File,
  supabaseClient: any
): Promise<string | null> {
  if (!file || file.size === 0) {
    console.warn("No file or empty file provided for upload.");
    return null;
  }

  const fileExtension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `public/${fileName}`;

  try {
    const { data, error } = await supabaseClient.storage
      .from("assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseClient.storage
      .from("assets")
      .getPublicUrl(data.path);

    if (!publicUrlData.publicUrl)
      throw new Error("Gagal mendapatkan URL publik setelah upload.");

    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("Error uploading image to Supabase Storage:", error.message);
    return null;
  }
}

export async function createCarouselSlide(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const headline = formData.get("headline") as string;
  const bodyText = formData.get("body_text") as string | null;
  const buttonText = formData.get("button_text") as string | null;
  const buttonLink = formData.get("button_link") as string | null;
  const altText = formData.get("alt_text") as string;
  const isAvailable = formData.get("is_active") === "on";
  const orderIndex = parseInt(formData.get("order_index") as string);

  const imageUrl = formData.get("image_url") as string | null;
  const imageFile = formData.get("image_file") as File | null;

  let finalImageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl;
    } else {
      return { success: false, message: "Gagal mengupload gambar." };
    }
  } else if (imageUrl) {
    finalImageUrl = imageUrl;
  } else {
    finalImageUrl = null;
  }

  const validatedFields = CarouselSlideSchema.safeParse({
    headline,
    body_text: bodyText || null,
    button_text: buttonText || null,
    button_link: buttonLink || null,
    alt_text: altText,
    is_active: isAvailable,
    order_index: orderIndex,
    image_url: finalImageUrl,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createCarouselSlide):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: newSlide, error } = await supabase
    .from("carousel_slides")
    .insert([validatedFields.data])
    .select()
    .single();

  if (error) {
    console.error("Error creating carousel slide:", error.message);
    return { success: false, message: `Gagal membuat slide: ${error.message}` };
  }

  revalidatePath("/mudir/carousel");
  revalidatePath("/");
  return {
    success: true,
    message: `Slide "${newSlide.headline}" berhasil ditambahkan.`,
  };
}

export async function updateCarouselSlide(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const headline = formData.get("headline") as string;
  const bodyText = formData.get("body_text") as string | null;
  const buttonText = formData.get("button_text") as string | null;
  const buttonLink = formData.get("button_link") as string | null;
  const altText = formData.get("alt_text") as string;
  const isAvailable = formData.get("is_active") === "on";
  const orderIndex = parseInt(formData.get("order_index") as string);

  const imageUrl = formData.get("image_url") as string | null;
  const imageFile = formData.get("image_file") as File | null;

  let finalImageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl;
    } else {
      return { success: false, message: "Gagal mengupload gambar baru." };
    }
  } else if (imageUrl) {
    finalImageUrl = imageUrl;
  } else {
    finalImageUrl = null;
  }

  const validatedFields = CarouselSlideSchema.safeParse({
    id,
    headline,
    body_text: bodyText || null,
    button_text: buttonText || null,
    button_link: buttonLink || null,
    alt_text: altText,
    is_active: isAvailable,
    order_index: orderIndex,
    image_url: finalImageUrl,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (updateCarouselSlide):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: updatedSlide, error } = await supabase
    .from("carousel_slides")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating carousel slide:", error.message);
    return {
      success: false,
      message: `Gagal memperbarui slide: ${error.message}`,
    };
  }

  revalidatePath("/mudir/carousel");
  revalidatePath(`/mudir/carousel/${id}/edit`);
  revalidatePath("/");
  return {
    success: true,
    message: `Slide "${updatedSlide.headline}" berhasil diperbarui.`,
  };
}

export async function deleteCarouselSlide(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("carousel_slides")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting carousel slide:", error.message);
    return {
      success: false,
      message: `Gagal menghapus slide: ${error.message}`,
    };
  }

  revalidatePath("/mudir/carousel");
  revalidatePath("/");
  return { success: true, message: "Slide berhasil dihapus." };
}

export async function toggleCarouselSlideAvailability(
  id: string,
  currentStatus: boolean
) {
  const supabase = await createServerSupabaseClient();

  const { data: updatedSlide, error } = await supabase
    .from("carousel_slides")
    .update({ is_active: !currentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling carousel slide availability:", error.message);
    return {
      success: false,
      message: `Gagal mengubah status ketersediaan slide: ${error.message}`,
    };
  }

  revalidatePath("/mudir/carousel");
  revalidatePath("/");
  return {
    success: true,
    message: `Status slide "${updatedSlide.headline}" berhasil diubah.`,
  };
}
