/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/actions/assets.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface StoredAsset {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
  publicUrl?: string;
  path: string;
}

export async function uploadAssetToSupabase(
  file: File
): Promise<{ publicUrl: string | null; error: string | null }> {
  const supabase = await createServerSupabaseClient();

  if (!file || file.size === 0) {
    return { publicUrl: null, error: "Tidak ada file atau file kosong." };
  }

  const fileExtension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `public/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(
        "Error uploading asset to Supabase Storage:",
        error.message
      );
      return { publicUrl: null, error: `Upload gagal: ${error.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("assets")
      .getPublicUrl(data.path);

    if (!publicUrlData.publicUrl) {
      return {
        publicUrl: null,
        error: "Gagal mendapatkan URL publik setelah upload.",
      };
    }

    revalidatePath("/mudir/assets");
    return { publicUrl: publicUrlData.publicUrl, error: null };
  } catch (error: any) {
    console.error("Unexpected error during asset upload:", error.message);
    return {
      publicUrl: null,
      error: `Upload gagal karena kesalahan tak terduga: ${error.message}`,
    };
  }
}

export async function getAssets(): Promise<{
  data: StoredAsset[];
  error: string | null;
}> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error(
        "Error listing assets from Supabase Storage:",
        error.message
      );
      return { data: [], error: `Gagal memuat daftar aset: ${error.message}` };
    }

    const filesWithUrls: StoredAsset[] = data
      .filter((item) => item.id !== ".emptyFolderPlaceholder") // placeholder
      .map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("assets")
          .getPublicUrl(`public/${file.name}`);
        return {
          ...file,
          publicUrl: publicUrlData.publicUrl || null,
          path: `public/${file.name}`,
        };
      })
      .filter((file) => file.publicUrl !== null) as StoredAsset[];

    return { data: filesWithUrls, error: null };
  } catch (error: any) {
    console.error("Unexpected error listing assets:", error.message);
    return { data: [], error: `Gagal memuat daftar aset: ${error.message}` };
  }
}

export async function deleteAsset(
  path: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.storage.from("assets").remove([path]);

    if (error) {
      console.error(
        "Error deleting asset from Supabase Storage:",
        error.message
      );
      return {
        success: false,
        error: `Gagal menghapus aset: ${error.message}`,
      };
    }

    revalidatePath("/mudir/assets");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected error deleting asset:", error.message);
    return {
      success: false,
      error: `Gagal menghapus aset karena kesalahan tak terduga: ${error.message}`,
    };
  }
}
