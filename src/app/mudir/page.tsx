// src/app/mudir/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import {
  getTotalSalesSummary,
  getMenuAndCarouselCounts,
  getRecentSalesTransactions,
  getTopSellingMenus,
} from "@/lib/actions/dashboard";
import { StatisticCard } from "@/components/admin/dashboard/StatisticCard";
import { RecentTransactionsList } from "@/components/admin/dashboard/RecentTransactionsList";
import { TopSellingMenusList } from "@/components/admin/dashboard/TopSellingMenusList";
import {
  ShoppingBagIcon,
  Squares2X2Icon,
  PhotoIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Dashboard - Admin Menurutmu",
  description: "Ringkasan dan statistik utama untuk admin Menurutmu.",
};

export default async function MudirDashboardPage() {
  const [
    salesSummary,
    counts,
    recentTransactionsResult,
    topSellingMenusResult,
  ] = await Promise.all([
    getTotalSalesSummary("monthly"),
    getMenuAndCarouselCounts(),
    getRecentSalesTransactions(5),
    getTopSellingMenus(3, "monthly"),
  ]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-8">
        Selamat Datang, Admin!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Suspense
          fallback={
            <StatisticCard
              title="Penjualan Bulan Ini"
              value="Memuat..."
              icon={ShoppingBagIcon}
            />
          }
        >
          <StatisticCard
            title="Penjualan Bulan Ini"
            value={salesSummary.totalAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
            description={`${salesSummary.count} transaksi`}
            icon={ShoppingBagIcon}
            error={salesSummary.error}
          />
        </Suspense>
        <Suspense
          fallback={
            <StatisticCard
              title="Menu Aktif"
              value="Memuat..."
              icon={Squares2X2Icon}
            />
          }
        >
          <StatisticCard
            title="Menu Aktif"
            value={counts.menuCount.toString()}
            description="item menu"
            icon={Squares2X2Icon}
            error={counts.error}
          />
        </Suspense>
        <Suspense
          fallback={
            <StatisticCard
              title="Carousel Aktif"
              value="Memuat..."
              icon={PhotoIcon}
            />
          }
        >
          <StatisticCard
            title="Carousel Aktif"
            value={counts.carouselCount.toString()}
            description="slide tayang"
            icon={PhotoIcon}
            error={counts.error}
          />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
            Transaksi Penjualan Terbaru
          </h2>
          <Suspense
            fallback={
              <div className="text-warm-brown text-center py-4">
                Memuat transaksi...
              </div>
            }
          >
            <RecentTransactionsList
              transactions={recentTransactionsResult.data}
              error={recentTransactionsResult.error}
            />
          </Suspense>
        </div>

        <div className="bg-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
            Menu Terlaris Bulan ini
          </h2>
          <Suspense
            fallback={
              <div className="text-warm-brown text-center py-4">
                Memuat menu terlaris...
              </div>
            }
          >
            <TopSellingMenusList
              menus={topSellingMenusResult.data}
              error={topSellingMenusResult.error}
            />
          </Suspense>
        </div>
      </div>

      {/* Placeholder Promo Aktif */}
      <div className="mt-6 bg-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          Promo Aktif & akan Datang
        </h2>
        <div className="flex items-center justify-center h-24 text-warm-brown font-body">
          <PresentationChartLineIcon className="h-8 w-8 mr-2" />
          <span>Fitur manajemen promo akan segera hadir!</span>
        </div>
      </div>
    </div>
  );
}
