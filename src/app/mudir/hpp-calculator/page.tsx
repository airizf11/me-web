// src/app/mudir/hpp-calculator/page.tsx
import { Metadata } from "next";
import { HppCalculatorForm } from "@/components/admin/hpp/HppCalculatorForm";

export const metadata: Metadata = {
  title: "Kalkulator HPP - Mudir Menurutmu",
  description:
    "Alat bantu untuk menghitung Harga Pokok Penjualan (HPP) dan perkiraan harga jual.",
};

export default function HppCalculatorPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Kalkulator HPP
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <HppCalculatorForm />
      </div>
    </div>
  );
}
