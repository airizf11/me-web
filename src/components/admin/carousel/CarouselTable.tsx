// src/components/admin/carousel/CarouselTable.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { type CarouselSlide } from "@/lib/types";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  deleteCarouselSlide,
  toggleCarouselSlideAvailability,
} from "@/lib/actions/carousel"; // Import Server Actions
import toast from "react-hot-toast";

type CarouselTableProps = {
  slides: CarouselSlide[];
};

export function CarouselTable({ slides }: CarouselTableProps) {
  const handleDelete = async (slide: CarouselSlide) => {
    if (
      confirm(
        `Yakin ingin menghapus slide "${slide.headline}"? Aksi ini tidak dapat dibatalkan.`
      )
    ) {
      toast.loading("Menghapus slide...");
      const result = await deleteCarouselSlide(slide.id);
      toast.dismiss();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menghapus slide.");
      }
    }
  };

  const handleToggleAvailability = async (slide: CarouselSlide) => {
    toast.loading("Mengubah status...");
    const result = await toggleCarouselSlideAvailability(
      slide.id,
      slide.is_active
    );
    toast.dismiss();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Gagal mengubah status.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-brown">
      <table className="min-w-full divide-y divide-warm-brown">
        <thead className="bg-warm-brown text-light-cream">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Gambar
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Headline
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Urutan
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
          {slides.map((slide) => (
            <tr
              key={slide.id}
              className="hover:bg-clay-pink/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-clay-pink flex items-center justify-center">
                  {slide.image_url ? (
                    <Image
                      src={slide.image_url}
                      alt={slide.alt_text || "Carousel slide"}
                      fill
                      sizes="64px"
                      style={{ objectFit: "cover" }}
                      className="object-center"
                    />
                  ) : (
                    <span className="text-xs text-warm-brown">No Image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium font-body">
                  {slide.headline}
                </div>
                {slide.body_text && (
                  <div className="text-xs text-warm-brown font-body truncate max-w-[200px]">
                    {slide.body_text}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-body">
                {slide.order_index}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    slide.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {slide.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2 justify-end">
                  <button
                    onClick={() => handleToggleAvailability(slide)}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label={slide.is_active ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {slide.is_active ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                  <Link
                    href={`/mudir/carousel/${slide.id}/edit`}
                    className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(slide)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="Hapus"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
