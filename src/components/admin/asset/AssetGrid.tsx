// src/components/admin/asset/AssetGrid.tsx
"use client";

import Image from "next/image";
import { type StoredAsset } from "@/lib/actions/assets";
import { PlayCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { deleteAsset } from "@/lib/actions/assets";

type AssetGridProps = {
  assets: StoredAsset[];
};

export function AssetGrid({ assets }: AssetGridProps) {
  const handleDelete = async (asset: StoredAsset) => {
    if (
      confirm(
        `Yakin ingin menghapus aset "${asset.name}"? Aksi ini tidak dapat dibatalkan.`
      )
    ) {
      toast.loading("Menghapus aset...");
      const result = await deleteAsset(asset.path);
      toast.dismiss();
      if (result.success) {
        toast.success(`Aset "${asset.name}" berhasil dihapus.`);
      } else {
        toast.error(result.error || "Gagal menghapus aset.");
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.name}
          className="relative aspect-square rounded-lg overflow-hidden border border-warm-brown shadow-md group"
        >
          {asset.publicUrl && asset.metadata?.mimetype?.startsWith("image/") ? (
            <Image
              src={asset.publicUrl}
              alt={asset.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform"
            />
          ) : asset.publicUrl &&
            asset.metadata?.mimetype?.startsWith("audio/") ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-clay-pink/50 text-deep-mocha p-2 text-center">
              <PlayCircleIcon className="h-10 w-10 mb-1" />
              <span className="text-xs text-center break-words">
                {asset.name}
              </span>
              <audio
                src={asset.publicUrl}
                controls
                className="w-full mt-2"
              ></audio>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs p-2 text-center">
              No Preview <br /> {asset.name}
            </div>
          )}

          <div className="absolute inset-0 bg-deep-mocha bg-opacity-70 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => handleDelete(asset)}
              className="p-2 rounded-full bg-red-500 text-light-cream hover:bg-red-600 transition-colors"
              aria-label={`Hapus aset ${asset.name}`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-deep-mocha bg-opacity-70 text-light-cream text-xs p-1 truncate">
            {asset.name}
          </div>
        </div>
      ))}
    </div>
  );
}
