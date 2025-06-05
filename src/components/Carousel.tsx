/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Carousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { createClient } from "@/lib/supabase/client";
import { type CarouselSlide } from "@/lib/types";

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const DEFAULT_IMAGE_PLACEHOLDER =
  "https://via.placeholder.com/1200x900?text=Menurutmu+Slide";

export function Carousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from("carousel_slides")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          setSlides([
            {
              id: "1",
              image_url: DEFAULT_IMAGE_PLACEHOLDER,
              alt_text: "Placeholder Slide 1",
              headline: "Renungkan Harimu",
              body_text:
                "Setiap tegukan adalah ajakan untuk berhenti sejenak dan berpikir.",
              button_text: "Jelajahi Refleksi",
              button_link: "#",
              order_index: 0,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "2",
              image_url: DEFAULT_IMAGE_PLACEHOLDER + "+2",
              alt_text: "Placeholder Slide 2",
              headline: "Apa Menurutmu Hari Ini?",
              body_text:
                "Mari berdialog tentang hal-hal yang benar-benar penting.",
              button_text: "Ikut Berdiskusi",
              button_link: "#",
              order_index: 1,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ] as CarouselSlide[]);
        } else {
          setSlides(data as CarouselSlide[]);
        }
      } catch (err: any) {
        console.error("Error fetching carousel slides:", err.message);
        setError("Gagal memuat carousel. Silakan coba lagi nanti.");
        setSlides([
          {
            id: "1",
            image_url: DEFAULT_IMAGE_PLACEHOLDER,
            alt_text: "Placeholder Error Slide",
            headline: "Oops! Terjadi Kesalahan",
            body_text: "Kami sedang memperbaiki ini.",
            button_text: null,
            button_link: null,
            order_index: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ] as CarouselSlide[]);
      } finally {
        setLoading(false);
      }
    }

    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="relative w-full aspect-[4/3] bg-clay-pink flex items-center justify-center text-warm-brown font-body text-xl rounded-lg">
        Memuat carousel...
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full aspect-[4/3] bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-xl">
      <div className="aspect-[4/3] w-full">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image_url || DEFAULT_IMAGE_PLACEHOLDER}
                  alt={slide.alt_text || "Carousel slide background"}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="brightness-[0.9]" // Sama seperti HeroSection, agar gambar tetap terlihat
                />
                {/* PENTING: Perbaikan Overlay Transparan */}
                <div
                  className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center"
                  style={{
                    backgroundColor: "rgba(109, 76, 65, 0.25)", // deep-mocha dengan opasitas 50%
                    color: "#EFE9E4", // light-cream untuk teks
                  }}
                >
                  <h2 className="text-4xl md:text-5xl font-display lowercase mb-4 leading-tight drop-shadow">
                    {slide.headline}
                  </h2>
                  {slide.body_text && (
                    <p className="text-lg md:text-xl font-body max-w-xl mb-6 drop-shadow">
                      {slide.body_text}
                    </p>
                  )}
                  {slide.button_text && slide.button_link && (
                    <Link
                      href={slide.button_link}
                      className="bg-clay-pink text-deep-mocha px-6 py-3 rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg shadow-lg"
                    >
                      {slide.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
