// src/lib/actions/promo.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { type Promo } from "@/lib/types";

const PromoSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nama promo tidak boleh kosong."),
  description: z.string().min(1, "Deskripsi tidak boleh kosong."),
  code: z.string().optional().nullable(),
  type: z.enum(["percentage", "fixed_amount", "bogo"]),
  value: z.number().min(0, "Nilai promo tidak boleh negatif."),
  min_order_amount: z.number().min(0).optional().nullable(),
  start_date: z.string().min(1, "Tanggal mulai tidak boleh kosong."),
  end_date: z.string().min(1, "Tanggal berakhir tidak boleh kosong."),
  is_active: z.boolean().default(false),
  target_type: z.enum(["all", "category", "menu_item"]),
  target_ids: z.array(z.string()).optional().nullable(),
});

export async function createPromo(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const targetIdsJson = formData.get("target_ids") as string | null;
  let targetIds: string[] | null = null;
  if (targetIdsJson) {
    try {
      targetIds = JSON.parse(targetIdsJson);
    } catch (e) {
      console.error("Invalid target_ids JSON");
    }
  }

  const validatedFields = PromoSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    code: formData.get("code") || null,
    type: formData.get("type"),
    value: parseFloat(formData.get("value") as string),
    min_order_amount:
      parseFloat(formData.get("min_order_amount") as string) || null,
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    is_active: formData.get("is_active") === "on",
    target_type: formData.get("target_type"),
    target_ids: targetIds,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (createPromo):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validasi gagal.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: newPromo, error } = await supabase
    .from("promos")
    .insert([validatedFields.data])
    .select()
    .single();
  if (error) {
    return { success: false, message: `Gagal membuat promo: ${error.message}` };
  }

  revalidatePath("/mudir/promos");
  revalidatePath("/mudir");
  revalidatePath("/menu");
  return {
    success: true,
    message: `Promo "${newPromo.name}" berhasil dibuat.`,
  };
}

export async function updatePromo(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const targetIdsJson = formData.get("target_ids") as string | null;
  let targetIds: string[] | null = null;
  if (targetIdsJson) {
    try {
      targetIds = JSON.parse(targetIdsJson);
    } catch (e) {
      console.error("Invalid target_ids JSON");
    }
  }

  const validatedFields = PromoSchema.safeParse({
    id,
    name: formData.get("name"),
    description: formData.get("description"),
    code: formData.get("code") || null,
    type: formData.get("type"),
    value: parseFloat(formData.get("value") as string),
    min_order_amount:
      parseFloat(formData.get("min_order_amount") as string) || null,
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    is_active: formData.get("is_active") === "on",
    target_type: formData.get("target_type"),
    target_ids: targetIds,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: updatedPromo, error } = await supabase
    .from("promos")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return {
      success: false,
      message: `Gagal memperbarui promo: ${error.message}`,
    };
  }

  revalidatePath("/mudir/promos");
  revalidatePath(`/mudir/promos/${id}/edit`);
  revalidatePath("/mudir");
  revalidatePath("/menu");
  return {
    success: true,
    message: `Promo "${updatedPromo.name}" berhasil diperbarui.`,
  };
}

export async function deletePromo(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("promos").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      message: `Gagal menghapus promo: ${error.message}`,
    };
  }

  revalidatePath("/mudir/promos");
  revalidatePath("/mudir");
  return { success: true, message: "Promo berhasil dihapus." };
}

export async function getPromoById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching promo ${id}:`, error.message);
    return { data: null, error: "Gagal memuat promo." };
  }
  return { data, error: null };
}

export async function getActivePromos() {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now);

  if (error) {
    console.error("Error fetching active promos:", error);
    return [];
  }
  return data as Promo[];
}
