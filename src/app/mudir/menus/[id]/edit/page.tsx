/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/menus/[id]/edit/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MenuForm } from "@/components/admin/menu/MenuForm";
import { type MenuItem } from "@/lib/types";
import { notFound } from "next/navigation";

interface EditMenuPageProps {
  params?: Promise<{
    id: string; // ID menu dari URL
  }>;
}

export async function generateMetadata({
  params,
}: EditMenuPageProps): Promise<Metadata> {
  // Secara paksa ekstrak nilai dari Promise (hati-hati!)
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: "Edit Menu - Mudir Menurutmu",
      description:
        "Formulir untuk mengedit item menu yang sudah ada di Menurutmu.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: menuItem } = await supabase
    .from("menus")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: menuItem
      ? `Edit "${menuItem.name}" - Mudir Menurutmu`
      : "Edit Menu - Mudir Menurutmu",
    description:
      "Formulir untuk mengedit item menu yang sudah ada di Menurutmu.",
  };
}

export default async function EditMenuPage({ params }: EditMenuPageProps) {
  // Secara paksa ekstrak nilai dari Promise
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
    return null; // Untuk memuaskan tipe
  }

  const supabase = await createServerSupabaseClient();
  let menuItem: MenuItem | null = null;
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError) {
      if (dbError.code === "PGRST116") {
        notFound();
      }
      throw dbError;
    }
    menuItem = data as MenuItem;
  } catch (err: any) {
    console.error("Error fetching menu item for edit:", err.message);
    error = "Gagal memuat detail menu. Silakan coba lagi nanti.";
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
          edit menu
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!menuItem) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        edit menu
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <MenuForm initialData={menuItem} />
      </div>
    </div>
  );
}
