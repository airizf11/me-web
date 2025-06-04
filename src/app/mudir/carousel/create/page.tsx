// src/app/mudir/carousel/create/page.tsx
import { Metadata } from "next";
import { CarouselForm } from "@/components/admin/carousel/CarouselForm";

export const metadata: Metadata = {
  title: "Tambah Slide Baru - Mudir Menurutmu",
  description: "Formulir untuk menambahkan slide carousel baru ke homepage.",
};

export default function CreateCarouselSlidePage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Tambah Slide Baru
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <CarouselForm />
      </div>
    </div>
  );
}
