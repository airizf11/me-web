// src/app/mudir/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import {
  getSalesSummary,
  getPurchaseSummary,
  getMenuAndCarouselCounts,
  getRecentSalesTransactions,
  getTopSellingMenus,
  getTopSpendingItems,
} from "@/lib/actions/dashboard";
import { StatisticCard } from "@/components/admin/dashboard/StatisticCard";
import { RecentTransactionsList } from "@/components/admin/dashboard/RecentTransactionsList";
import { TopSellingMenusList } from "@/components/admin/dashboard/TopSellingMenusList";
import {
  ShoppingBagIcon,
  Squares2X2Icon,
  PhotoIcon,
  PresentationChartLineIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  CubeTransparentIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { TopSpendingItemsList } from "@/components/admin/dashboard/TopSpendingItemsList";

export const metadata: Metadata = {
  title: "Dashboard - Mudir Menurutmu",
  description: "Ringkasan dan statistik utama untuk admin Menurutmu.",
};

export default async function MudirDashboardPage() {
  const [
    monthlySalesSummary,
    monthlyPurchaseSummary,
    counts,
    recentSalesTransactionsResult,
    topSellingMenusResult,
    topSpendingItemsResult,
  ] = await Promise.all([
    getSalesSummary("monthly"),
    getPurchaseSummary("monthly"),
    getMenuAndCarouselCounts(),
    getRecentSalesTransactions(5),
    getTopSellingMenus(3, "monthly"),
    getTopSpendingItems(3, "monthly"),
  ]);

  const salesToday = await getSalesSummary("daily");
  const purchasesToday = await getPurchaseSummary("daily");

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-8">
        selamat datang, mudir!
      </h1>

      <div className="mb-10">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-6">
          gambaran umum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <Suspense
            fallback={
              <StatisticCard
                title="Promo Aktif"
                value="Memuat..."
                icon={ReceiptPercentIcon}
              />
            }
          >
            <StatisticCard
              title="Promo Aktif"
              value={counts.promoCount.toString()}
              description="promo sedang berjalan"
              icon={ReceiptPercentIcon}
              error={counts.error}
            />
          </Suspense>
          <Suspense
            fallback={
              <StatisticCard
                title="Total Aset"
                value="Memuat..."
                icon={FolderIcon}
              />
            }
          >
            <StatisticCard
              title="Total Aset"
              value="?" // Placeholder ?
              description="gambar & audio"
              icon={FolderIcon}
              // error={assetsCount.error} // Jika sudah ada
            />
          </Suspense>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-6">
          penjualan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Suspense
            fallback={
              <StatisticCard
                title="Penjualan Hari Ini"
                value="Memuat..."
                icon={ShoppingBagIcon}
              />
            }
          >
            <StatisticCard
              title="Penjualan Hari Ini"
              value={salesToday.totalAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
              description={`${salesToday.count} transaksi`}
              icon={ShoppingBagIcon}
              error={salesToday.error}
            />
          </Suspense>
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
              value={monthlySalesSummary.totalAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
              description={`${monthlySalesSummary.count} transaksi`}
              icon={ShoppingBagIcon}
              error={monthlySalesSummary.error}
            />
          </Suspense>
          <Suspense
            fallback={
              <StatisticCard
                title="PCS Terjual Bulan Ini"
                value="Memuat..."
                icon={CubeTransparentIcon}
              />
            }
          >
            <StatisticCard
              title="PCS Terjual Bulan Ini"
              value={monthlySalesSummary.totalPcs.toLocaleString("id-ID")}
              description="item"
              icon={CubeTransparentIcon}
              error={monthlySalesSummary.error}
            />
          </Suspense>
          <Suspense
            fallback={
              <StatisticCard
                title="Profit (Gross) Bulan Ini"
                value="Memuat..."
                icon={CurrencyDollarIcon}
              />
            }
          >
            <StatisticCard
              title="Profit (Gross) Bulan Ini"
              value="?" // Placeholder ?
              description="estimasi profit"
              icon={CurrencyDollarIcon}
              // error={profitSummary.error}
            />
          </Suspense>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-6">
          pengeluaran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Suspense
            fallback={
              <StatisticCard
                title="Pengeluaran Hari Ini"
                value="Memuat..."
                icon={BuildingStorefrontIcon}
              />
            }
          >
            <StatisticCard
              title="Pengeluaran Hari Ini"
              value={purchasesToday.totalAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
              description={`${purchasesToday.count} transaksi`}
              icon={BuildingStorefrontIcon}
              error={purchasesToday.error}
            />
          </Suspense>
          <Suspense
            fallback={
              <StatisticCard
                title="Pengeluaran Bulan Ini"
                value="Memuat..."
                icon={BuildingStorefrontIcon}
              />
            }
          >
            <StatisticCard
              title="Pengeluaran Bulan Ini"
              value={monthlyPurchaseSummary.totalAmount.toLocaleString(
                "id-ID",
                { style: "currency", currency: "IDR" }
              )}
              description={`${monthlyPurchaseSummary.count} transaksi`}
              icon={BuildingStorefrontIcon}
              error={monthlyPurchaseSummary.error}
            />
          </Suspense>
          {/* Bisa tambah metrik lain like biaya bahan baku, biaya operasional dll */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
            transaksi penjualan terbaru
          </h2>
          <Suspense
            fallback={
              <div className="text-warm-brown text-center py-4">
                Memuat transaksi...
              </div>
            }
          >
            <RecentTransactionsList
              transactions={recentSalesTransactionsResult.data}
              error={recentSalesTransactionsResult.error}
            />
          </Suspense>
          <div className="mt-4 text-right">
            <Link
              href="/mudir/transactions"
              className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
            >
              Lihat Semua Penjualan
            </Link>
          </div>
        </div>

        <div className="bg-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
            menu terlaris bulan ini
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
          <div className="mt-4 text-right">
            <Link
              href="/mudir/menus"
              className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          item pengeluaran teratas bulan ini
        </h2>
        <Suspense
          fallback={
            <div className="text-warm-brown text-center py-4">
              Memuat item pengeluaran...
            </div>
          }
        >
          <TopSpendingItemsList
            items={topSpendingItemsResult.data}
            error={topSpendingItemsResult.error}
          />{" "}
          {/* Akan dibuat */}
        </Suspense>
        <div className="mt-4 text-right">
          <Link
            href="/mudir/purchases"
            className="inline-flex items-center text-sm font-body text-deep-mocha hover:text-warm-brown transition-colors"
          >
            Lihat Semua Pembelian
          </Link>
        </div>
      </div>

      {/* --- Placeholder Promo --- */}
      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          promo aktif & akan datang
        </h2>
        <div className="flex items-center justify-center h-24 text-warm-brown font-body">
          <PresentationChartLineIcon className="h-8 w-8 mr-2" />
          <span>Akan segera hadir!</span>
        </div>
      </div>
    </div>
  );
}
