// src/components/admin/carousel/CarouselForm.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { type CarouselSlide } from "@/lib/types";
import {
  createCarouselSlide,
  updateCarouselSlide,
} from "@/lib/actions/carousel"; // Import Server Actions
import { useRouter } from "next/navigation";
import { AssetManager } from "@/components/admin/AssetManager"; // Import AssetManager

type CarouselFormProps = {
  initialData?: CarouselSlide | null; // Untuk mode edit
};

export function CarouselForm({ initialData }: CarouselFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const router = useRouter();

  // State lokal untuk form input
  const [headline, setHeadline] = useState(initialData?.headline || "");
  const [bodyText, setBodyText] = useState(initialData?.body_text || "");
  const [buttonText, setButtonText] = useState(initialData?.button_text || "");
  const [buttonLink, setButtonLink] = useState(initialData?.button_link || "");
  const [altText, setAltText] = useState(initialData?.alt_text || "");
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(
    initialData?.image_url || null
  );

  useEffect(() => {
    setHeadline(initialData?.headline || "");
    setBodyText(initialData?.body_text || "");
    setButtonText(initialData?.button_text || "");
    setButtonLink(initialData?.button_link || "");
    setAltText(initialData?.alt_text || "");
    setOrderIndex(initialData?.order_index || 0);
    setIsActive(initialData?.is_active ?? true);
    setFinalImageUrl(initialData?.image_url || null);
    setErrors(null);
  }, [initialData]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    // Data dari AssetManager untuk gambar
    formData.set("image_url", finalImageUrl || ""); // URL final dari AssetManager
    // File sebenarnya tidak perlu di-set di sini, karena AssetManager yang mengurus upload ke storage.
    // Kita hanya perlu URL-nya.

    let result;
    if (initialData?.id) {
      result = await updateCarouselSlide(initialData.id, formData);
    } else {
      result = await createCarouselSlide(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      router.push("/mudir/carousel"); // Redirect kembali ke halaman daftar slide
    } else {
      toast.error(result.message || "Operasi gagal.");
      if (result.errors) {
        setErrors(result.errors);
      }
      console.error("Form Submission Error:", result.errors);
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="headline"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Headline (Judul Utama)
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.headline && (
          <p className="text-red-500 text-xs mt-1">{errors.headline[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="body_text"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Body Text (Deskripsi)
        </label>
        <textarea
          id="body_text"
          name="body_text"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={3}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        ></textarea>
        {errors?.body_text && (
          <p className="text-red-500 text-xs mt-1">{errors.body_text[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="button_text"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Teks Tombol (Opsional)
        </label>
        <input
          type="text"
          id="button_text"
          name="button_text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        />
        {errors?.button_text && (
          <p className="text-red-500 text-xs mt-1">{errors.button_text[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="button_link"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Link Tombol (URL, Opsional)
        </label>
        <input
          type="url"
          id="button_link"
          name="button_link"
          value={buttonLink}
          onChange={(e) => setButtonLink(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        />
        {errors?.button_link && (
          <p className="text-red-500 text-xs mt-1">{errors.button_link[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="alt_text"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Alt Text Gambar (Wajib)
        </label>
        <input
          type="text"
          id="alt_text"
          name="alt_text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.alt_text && (
          <p className="text-red-500 text-xs mt-1">{errors.alt_text[0]}</p>
        )}
      </div>

      {/* --- Integrasi AssetManager --- */}
      <div className="my-6">
        <label className="block text-sm font-body text-deep-mocha mb-2">
          Gambar Slide
        </label>
        <AssetManager
          onAssetSelect={setFinalImageUrl}
          initialAssetUrl={initialData?.image_url}
          allowedFileTypes="image/*" // Hanya izinkan gambar untuk slide
          bucketName="assets"
          fileInputLabel="Pilih gambar untuk slide"
        />
      </div>
      {/* --- Akhir Integrasi AssetManager --- */}

      <div>
        <label
          htmlFor="order_index"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Order Index (Urutan Tampilan)
        </label>
        <input
          type="number"
          id="order_index"
          name="order_index"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.order_index && (
          <p className="text-red-500 text-xs mt-1">{errors.order_index[0]}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-deep-mocha focus:ring-deep-mocha border-warm-brown rounded"
          disabled={loading}
        />
        <label
          htmlFor="is_active"
          className="ml-2 block text-sm font-body text-deep-mocha"
        >
          Aktif
        </label>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/mudir/carousel")}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
              {initialData ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Slide"
          )}
        </button>
      </div>
    </form>
  );
}
