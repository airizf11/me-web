/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/assets/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { getAssets, uploadAssetToSupabase } from "@/lib/actions/assets";
import { AssetGrid } from "@/components/admin/asset/AssetGrid";
import { AssetUploadForm } from "@/components/admin/asset/AssetUploadForm";

export const metadata: Metadata = {
  title: "Manajemen Aset - Mudir Menurutmu",
  description: "Kelola semua aset media (gambar, audio) Menurutmu.",
};

export default async function AssetsManagementPage() {
  const { data: assets, error } = await getAssets();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Manajemen Aset
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Upload Aset Baru
        </h2>
        <AssetUploadForm />
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Galeri Aset
        </h2>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada aset yang diupload.
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="text-center text-warm-brown">
                Memuat galeri...
              </div>
            }
          >
            <AssetGrid assets={assets} />{" "}
          </Suspense>
        )}
      </div>
    </div>
  );
}
