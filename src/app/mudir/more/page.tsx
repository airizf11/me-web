// src/app/mudir/more/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  HomeIcon,
  ListBulletIcon,
  PhotoIcon,
  ShoppingCartIcon,
  FolderIcon,
  CubeIcon,
  CalculatorIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Menu Lainnya - Mudir Menurutmu",
  description: "Daftar lengkap fitur dan manajemen di panel admin Menurutmu.",
};

const allAdminFeatures = [
  {
    name: "Dashboard",
    href: "/mudir",
    icon: HomeIcon,
    description: "Gambaran umum kinerja bisnis.",
  },
  {
    name: "Manajemen Menu",
    href: "/mudir/menus",
    icon: ListBulletIcon,
    description: "Kelola daftar minuman dan detailnya.",
  },
  {
    name: "Manajemen Carousel",
    href: "/mudir/carousel",
    icon: PhotoIcon,
    description: "Atur slide homepage yang dinamis.",
  },
  {
    name: "Catatan Penjualan",
    href: "/mudir/transactions",
    icon: ShoppingCartIcon,
    description: "Input transaksi penjualan harian.",
  },
  {
    name: "Manajemen Pembelian",
    href: "/mudir/purchases",
    icon: ShoppingBagIcon,
    description: "Catat pengeluaran bahan baku dan operasional.",
  },
  {
    name: "Manajemen Bahan Baku",
    href: "/mudir/raw-materials",
    icon: CubeIcon,
    description: "Kelola inventaris dan harga bahan baku.",
  },
  {
    name: "Kalkulator HPP",
    href: "/mudir/hpp-calculator",
    icon: CalculatorIcon,
    description: "Hitung Harga Pokok Penjualan per sajian.",
  },
  {
    name: "Manajemen Aset",
    href: "/mudir/assets",
    icon: FolderIcon,
    description: "Kelola semua gambar dan file media.",
  },
  {
    name: "Manajemen Promo",
    href: "/mudir/promos",
    icon: ReceiptPercentIcon,
    description: "Buat dan kelola promo aktif. (Akan Datang)",
  },
  {
    name: "Manajemen Pengguna",
    href: "/mudir/users",
    icon: UserGroupIcon,
    description: "Kelola akun admin dan owner. (Akan Datang)",
  }, // Placeholder
  {
    name: "Pengaturan",
    href: "/mudir/settings",
    icon: Cog6ToothIcon,
    description: "Atur konfigurasi sistem. (Akan Datang)",
  }, // Placeholder
];

export default function MoreOptionsPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-8 text-center md:text-left">
        Menu Lainnya
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAdminFeatures.map((feature) => (
          <Link
            href={feature.href}
            key={feature.name}
            className="block bg-light-cream p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-clay-pink/50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <feature.icon className="h-10 w-10 text-deep-mocha group-hover:text-warm-brown transition-colors" />
              <div>
                <h2 className="text-xl font-display lowercase text-deep-mocha leading-tight">
                  {feature.name}
                </h2>
                <p className="text-sm font-body text-warm-brown mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
