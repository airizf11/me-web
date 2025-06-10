/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/carousel/[id]/edit/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CarouselForm } from "@/components/admin/carousel/CarouselForm";
import { type CarouselSlide } from "@/lib/types";
import { notFound } from "next/navigation";

interface EditCarouselPageProps {
  params?: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditCarouselPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: "Edit Slide - Mudir Menurutmu",
      description: "Formulir untuk mengedit slide carousel yang sudah ada.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: slide } = await supabase
    .from("carousel_slides")
    .select("headline")
    .eq("id", id)
    .single();

  return {
    title: slide
      ? `Edit "${slide.headline}" - Mudir Menurutmu`
      : "Edit Slide - Mudir Menurutmu",
    description: "Formulir untuk mengedit slide carousel yang sudah ada.",
  };
}

export default async function EditCarouselSlidePage({
  params,
}: EditCarouselPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
    return null;
  }

  const supabase = await createServerSupabaseClient();
  let slide: CarouselSlide | null = null;
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("carousel_slides")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError) {
      if (dbError.code === "PGRST116") {
        notFound();
      }
      throw dbError;
    }
    slide = data as CarouselSlide;
  } catch (err: any) {
    console.error("Error fetching carousel slide for edit:", err.message);
    error = "Gagal memuat detail slide. Silakan coba lagi nanti.";
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
          Edit Slide
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!slide) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Edit Slide
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <CarouselForm initialData={slide} />
      </div>
    </div>
  );
}
