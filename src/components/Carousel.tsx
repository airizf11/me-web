// src/components/Carousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { type CarouselSlide } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const DEFAULT_IMAGE_PLACEHOLDER =
  "https://via.placeholder.com/1200x900?text=Menurutmu+Slide";

type CarouselProps = {
  slides: CarouselSlide[];
};

export function Carousel({ slides }: CarouselProps) {
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] bg-clay-pink flex items-center justify-center text-warm-brown font-body text-xl rounded-lg shadow-xl">
        Konten reflektif akan segera hadir.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-xl">
      <div className="aspect-[3/4] w-full">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
                  className="brightness-[0.8]"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end items-center p-8 md:p-12 text-center"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(109, 76, 65, 0.6) 0%, rgba(109, 76, 65, 0) 60%)",
                    color: "#EFE9E4",
                  }}
                >
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-display lowercase mb-4 leading-tight drop-shadow-md">
                      {slide.headline}
                    </h2>
                    {slide.body_text && (
                      <p className="text-base md:text-lg font-body mb-6 drop-shadow">
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
