// src/components/admin/AssetManager.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowUpTrayIcon,
  LinkIcon,
  PhotoIcon,
  PlayCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress";

interface SupabaseFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
  publicUrl?: string;
}

type AssetManagerProps = {
  onAssetSelect: (url: string | null) => void;
  initialAssetUrl?: string | null;
  allowedFileTypes?: string;
  bucketName?: string;
  fileInputLabel?: string;
};

export function AssetManager({
  onAssetSelect,
  initialAssetUrl = null,
  allowedFileTypes = "image/*,audio/*",
  bucketName = "assets",
  fileInputLabel = "Pilih file untuk diupload",
}: AssetManagerProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"upload" | "gallery" | "url">(
    initialAssetUrl ? "url" : "upload"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAssetUrl);
  const [manualUrl, setManualUrl] = useState<string>(initialAssetUrl || "");

  const [galleryFiles, setGalleryFiles] = useState<SupabaseFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setPreviewUrl(initialAssetUrl);
    setManualUrl(initialAssetUrl || "");
    if (initialAssetUrl) {
      setActiveTab("url");
    } else {
      setActiveTab("upload");
    }
  }, [initialAssetUrl]);

  const fetchGalleryFiles = async () => {
    setLoadingGallery(true);
    setGalleryFiles([]);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list("public", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const filesWithUrls: SupabaseFile[] = data
        .filter((item) => item.id !== ".emptyFolderPlaceholder")
        .map((file) => {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`public/${file.name}`);
          return { ...file, publicUrl: publicUrlData.publicUrl || null };
        })
        .filter((file) => file.publicUrl !== null) as SupabaseFile[];

      setGalleryFiles(filesWithUrls);
    } catch (error: any) {
      toast.error(
        `Gagal memuat galeri aset: ${error.message}. Pastikan RLS Storage sudah diatur!`
      );
      console.error("Error fetching gallery files:", error.message);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (activeTab === "gallery") {
      fetchGalleryFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setManualUrl("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        onAssetSelect(null);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast("Silakan pilih file untuk diupload.", { icon: "ℹ️" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const loadingToastId = toast.loading("Mengupload file...");

    const fileExtension = selectedFile.name.split(".").pop();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${uniqueId}-${selectedFile.name.replace(
      /\s/g,
      "-"
    )}`;
    const filePath = `public/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          // opsional progress bar real-time
          // butuh custom upload endpoint/streaming.
          // onUploadProgress: (event) => {
          //   if (event.lengthComputable) {
          //     const percentCompleted = Math.round((event.loaded * 100) / event.total);
          //     setUploadProgress(percentCompleted);
          //   }
          // },
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl)
        throw new Error("Gagal mendapatkan URL publik.");

      toast.success("Upload berhasil!", { id: loadingToastId });
      setSelectedFile(null);
      setPreviewUrl(publicUrlData.publicUrl);
      setManualUrl(publicUrlData.publicUrl);
      onAssetSelect(publicUrlData.publicUrl);
      setActiveTab("url");
      fetchGalleryFiles();
    } catch (error: any) {
      toast.error(`Upload gagal: ${error.message}`, { id: loadingToastId });
      console.error("Upload error:", error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    setManualUrl(url);
    setSelectedFile(null);
    setPreviewUrl(url || null);
    onAssetSelect(url || null);
  };

  const handleSelectFromGallery = (file: SupabaseFile) => {
    if (file.publicUrl) {
      setManualUrl(file.publicUrl);
      setPreviewUrl(file.publicUrl);
      setSelectedFile(null);
      onAssetSelect(file.publicUrl);
      setActiveTab("url");
    } else {
      toast.error("URL publik aset tidak ditemukan.");
    }
  };

  const handleRemoveSelectedAsset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setManualUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onAssetSelect(null);
    setActiveTab("upload");
  };

  return (
    <div className="border border-warm-brown rounded-lg p-4 bg-light-cream">
      {(initialAssetUrl || previewUrl || manualUrl) && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleRemoveSelectedAsset}
            className="text-red-500 hover:text-red-700 flex items-center text-sm font-body"
          >
            <XMarkIcon className="h-4 w-4 mr-1" /> Hapus Aset Terpilih
          </button>
        </div>
      )}

      <div className="flex border-b border-warm-brown mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 font-body text-sm ${
            activeTab === "upload"
              ? "border-b-2 border-deep-mocha text-deep-mocha font-semibold"
              : "text-warm-brown hover:text-deep-mocha"
          }`}
        >
          Upload Baru
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2 font-body text-sm ${
            activeTab === "gallery"
              ? "border-b-2 border-deep-mocha text-deep-mocha font-semibold"
              : "text-warm-brown hover:text-deep-mocha"
          }`}
        >
          Pilih dari Galeri
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`px-4 py-2 font-body text-sm ${
            activeTab === "url"
              ? "border-b-2 border-deep-mocha text-deep-mocha font-semibold"
              : "text-warm-brown hover:text-deep-mocha"
          }`}
        >
          URL Eksternal
        </button>
      </div>

      <div className="min-h-[150px]">
        {activeTab === "upload" && (
          <div className="space-y-4">
            <label
              htmlFor="asset_upload"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              {fileInputLabel}
            </label>
            <input
              type="file"
              id="asset_upload"
              ref={fileInputRef}
              accept={allowedFileTypes}
              onChange={handleFileChange}
              className="w-full text-deep-mocha text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-clay-pink file:text-deep-mocha hover:file:bg-warm-brown hover:file:text-light-cream file:transition-colors file:duration-200"
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-2">
                <Progress
                  value={uploadProgress}
                  className="w-full bg-warm-brown"
                />
                <p className="text-xs text-warm-brown text-center mt-1">
                  {uploadProgress}%
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="mt-4 px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
                  Mengupload...
                </>
              ) : (
                "Upload File"
              )}
            </button>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display lowercase text-deep-mocha">
                galeri aset
              </h3>
              <button
                type="button"
                onClick={fetchGalleryFiles}
                className="flex items-center text-sm text-deep-mocha hover:text-warm-brown"
                disabled={loadingGallery}
              >
                <ArrowPathIcon
                  className={`h-4 w-4 mr-1 ${
                    loadingGallery ? "animate-spin" : ""
                  }`}
                />
                {loadingGallery ? "Memuat..." : "Refresh"}
              </button>
            </div>
            {loadingGallery ? (
              <div className="text-center text-warm-brown">Memuat aset...</div>
            ) : galleryFiles.length === 0 ? (
              <div className="text-center text-warm-brown">
                Tidak ada aset di galeri.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
                {galleryFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleSelectFromGallery(file)}
                    className="relative aspect-square w-full rounded-md overflow-hidden border border-warm-brown cursor-pointer hover:border-deep-mocha hover:shadow-md transition-all group"
                  >
                    {file.publicUrl &&
                    file.metadata?.mimetype?.startsWith("image/") ? (
                      <Image
                        src={file.publicUrl}
                        alt={file.name}
                        fill
                        sizes="100px"
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform"
                      />
                    ) : file.publicUrl &&
                      file.metadata?.mimetype?.startsWith("audio/") ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-clay-pink/50 text-deep-mocha p-2 text-center">
                        <PlayCircleIcon className="h-10 w-10 mb-1" />
                        <span className="text-xs text-center break-words">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                        No Preview
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-deep-mocha bg-opacity-70 text-light-cream text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-4">
            <label
              htmlFor="external_url"
              className="block text-sm font-body text-deep-mocha mb-1"
            >
              URL Aset Eksternal
            </label>
            <input
              type="url"
              id="external_url"
              value={manualUrl}
              onChange={handleManualUrlChange}
              className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
              placeholder="https://example.com/your-asset.jpg"
              disabled={uploading}
            />
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-6 border-t border-warm-brown pt-6">
          <h3 className="text-lg font-display lowercase text-deep-mocha mb-3">
            pratinjau aset terpilih
          </h3>
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-deep-mocha shadow-md mx-auto">
            {previewUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
              <Image
                src={previewUrl}
                alt="Selected Asset Preview"
                fill
                style={{ objectFit: "cover" }}
                sizes="192px"
              />
            ) : previewUrl.match(/\.(mp3|wav|ogg|aac|m4a)$/i) ? (
              <div className="flex flex-col items-center justify-center h-full w-full bg-clay-pink text-deep-mocha p-2">
                <PlayCircleIcon className="h-12 w-12 mb-2" />
                <span className="text-sm font-body text-center break-words">
                  Audio File
                </span>
                <audio
                  src={previewUrl}
                  controls
                  className="w-full mt-2"
                ></audio>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500 text-sm p-2 text-center">
                Tidak ada pratinjau untuk jenis file ini.
                <br />
                URL: {previewUrl}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
