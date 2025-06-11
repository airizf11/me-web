/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/raw-materials/[id]/edit/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClientReadOnly } from "@/lib/supabase/server";
import { RawMaterialForm } from "@/components/admin/raw-material/RawMaterialForm";
import { type RawMaterial } from "@/lib/types";
import { getRawMaterialById } from "@/lib/actions/raw_materials";
import { notFound } from "next/navigation";

interface EditRawMaterialPageProps {
  params?: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditRawMaterialPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: "Edit Bahan Baku - Mudir Menurutmu",
      description: "Formulir untuk mengedit data bahan baku.",
    };
  }

  const { data: rawMaterial } = await getRawMaterialById(id);

  return {
    title: rawMaterial
      ? `Edit "${rawMaterial.name}" - Mudir Menurutmu`
      : "Edit Bahan Baku - Mudir Menurutmu",
    description: "Formulir untuk mengedit data bahan baku.",
  };
}

export default async function EditRawMaterialPage({
  params,
}: EditRawMaterialPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
    return null;
  }

  const { data: rawMaterial, error } = await getRawMaterialById(id);

  if (error || !rawMaterial) {
    console.error("Error fetching raw material for edit:", error);
    notFound();
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Edit Bahan Baku
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <RawMaterialForm initialData={rawMaterial} />{" "}
      </div>
    </div>
  );
}
