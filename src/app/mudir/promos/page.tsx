// src/app/mudir/promos/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Manajemen Promo - Mudir Menurutmu",
  description: "Kelola daftar promosi dan diskon untuk minuman Menurutmu.",
};

export default function PromosManagementPage() {
  const dummyPromos = [
    {
      id: 1,
      name: "Diskon 10% Semua Menu",
      status: "Aktif",
      expires: "31 Des 2024",
    },
    {
      id: 2,
      name: "Beli 2 Kopi Vanilla Gratis 1 Kopi Hitam",
      status: "Akan Datang",
      expires: "1 Jan 2025",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Manajemen Promo
      </h1>

      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase mb-4">
          Ringkasan Promo
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-body">Promo Aktif Saat Ini:</span>
          <span className="text-3xl font-bold font-body">
            {dummyPromos.filter((p) => p.status === "Aktif").length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-body">Total Promo Tersimpan:</span>
          <span className="text-3xl font-bold font-body">
            {dummyPromos.length}
          </span>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/promos/create" // Placeholder
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors flex items-center"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Tambah Promo Baru
        </Link>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Daftar Promo
        </h2>

        {dummyPromos.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada promo yang dicatat.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-warm-brown">
            <table className="min-w-full divide-y divide-warm-brown">
              <thead className="bg-warm-brown text-light-cream">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Nama Promo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Berakhir
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
                {dummyPromos.map((promo) => (
                  <tr
                    key={promo.id}
                    className="hover:bg-clay-pink/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium font-body">
                        {promo.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          promo.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-body">{promo.expires}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <Link
                          href={`/mudir/promos/${promo.id}/edit`}
                          className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                        >
                          Edit
                        </Link>
                        <button className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center pt-8 text-warm-brown font-body">
        <SparklesIcon className="h-6 w-6 mr-2" />
        <span>Fitur manajemen promo sedang dalam pengembangan penuh!</span>
      </div>
    </div>
  );
}
