/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/mudir/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MudirDashboardPage() {
  const [menuCount, setMenuCount] = useState<number | null>(null);
  const [carouselCount, setCarouselCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const { count: menuDataCount, error: menuError } = await supabase
          .from("menus")
          .select("*", { count: "exact", head: true })
          .eq("is_available", true);

        if (menuError) throw menuError;
        setMenuCount(menuDataCount);

        const { count: carouselDataCount, error: carouselError } =
          await supabase
            .from("carousel_slides")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        if (carouselError) throw carouselError;
        setCarouselCount(carouselDataCount);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err.message);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-8">
        selamat datang, Admin!
      </h1>
      <p className="text-lg font-body text-warm-brown mb-12 text-center">
        Ini adalah panel kontrol Anda. Pilih menu di sidebar untuk mulai
        mengelola.
      </p>

      {loading ? (
        <div className="text-deep-mocha font-body text-xl">Memuat data...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-display lowercase mb-2">total menu</h3>
            <p className="text-3xl font-bold font-body">{menuCount}</p>
            <p className="text-sm">aktif</p>
          </div>
          <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-display lowercase mb-2">
              carousel slides
            </h3>
            <p className="text-3xl font-bold font-body">{carouselCount}</p>
            <p className="text-sm">tayang</p>
          </div>
          <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-display lowercase mb-2">
              feedback terbaru
            </h3>
            <p className="text-lg font-body">Belum ada</p> {/* placeholder */}
            <p className="text-sm">dari konsumen</p>
          </div>
        </div>
      )}
    </div>
  );
}
