/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/asset/AssetUploadForm.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { uploadAssetToSupabase } from "@/lib/actions/assets";
import { Progress } from "@/components/ui/progress";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export function AssetUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(10);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast("Pilih file untuk diupload.", { icon: "ℹ️" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const loadingToastId = toast.loading("Mengupload file...");

    const { publicUrl, error } = await uploadAssetToSupabase(selectedFile);

    toast.dismiss(loadingToastId);
    if (error) {
      toast.error(error);
    } else {
      toast.success(`"${selectedFile.name}" berhasil diupload!`);
      setSelectedFile(null);
      setUploadProgress(100);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full text-deep-mocha text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-clay-pink file:text-deep-mocha hover:file:bg-warm-brown hover:file:text-light-cream file:transition-colors file:duration-200"
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-2">
          <Progress value={uploadProgress} className="w-full bg-warm-brown" />
          <p className="text-xs text-warm-brown text-center mt-1">
            Mengupload...
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {uploading ? (
          <>
            <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
            Mengupload...
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" /> Upload
          </>
        )}
      </button>
    </div>
  );
}
