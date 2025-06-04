/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/carousel/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type CarouselSlide } from "@/lib/types";
import { CarouselTable } from "@/components/admin/carousel/CarouselTable"; // Import CarouselTable

export const metadata: Metadata = {
  title: "Manajemen Carousel - Mudir Menurutmu",
  description: "Kelola slide carousel untuk homepage Menurutmu.",
};

export default async function CarouselManagementPage() {
  const supabase = await createServerSupabaseClient();

  let carouselSlides: CarouselSlide[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from("carousel_slides")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false }); // Urutkan juga berdasarkan waktu pembuatan

    if (dbError) {
      throw dbError;
    }
    carouselSlides = data as CarouselSlide[];
  } catch (err: any) {
    console.error("Error fetching carousel slides for admin:", err.message);
    error = "Gagal memuat data slide. Silakan coba lagi nanti.";
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Manajemen Carousel
      </h1>

      {/* Tombol Tambah Slide Baru */}
      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/carousel/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors"
        >
          Tambah Slide Baru
        </Link>
      </div>

      {/* Bagian Daftar Slide */}
      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Daftar Slide
        </h2>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : carouselSlides.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada slide carousel yang ditambahkan.
          </div>
        ) : (
          <CarouselTable slides={carouselSlides} />
        )}
      </div>
    </div>
  );
}
