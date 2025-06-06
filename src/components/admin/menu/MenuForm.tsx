/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/menu/MenuForm.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { type MenuItem } from "@/lib/types";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu";
import { useRouter } from "next/navigation";
import { AssetManager } from "@/components/admin/AssetManager";
import {
  PencilIcon,
  PlusCircleIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type MenuFormProps = {
  initialData?: MenuItem | null;
};

export function MenuForm({ initialData }: MenuFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(
    initialData?.image_url || null
  );
  const [category, setCategory] = useState(initialData?.category || "Coffee");
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available ?? true
  );
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0);

  // PENTING: Inisialisasi additionalImages dengan array kosong jika null/undefined/bukan array
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    Array.isArray(initialData?.additional_images)
      ? initialData.additional_images
      : []
  );

  const [currentAdditionalImageIndex, setCurrentAdditionalImageIndex] =
    useState<number | null>(null);
  const [showAdditionalImageModal, setShowAdditionalImageModal] =
    useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setSlug(initialData?.slug || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || 0);
    setFinalImageUrl(initialData?.image_url || null);
    setCategory(initialData?.category || "Coffee");
    setIsAvailable(initialData?.is_available ?? true);
    setOrderIndex(initialData?.order_index || 0);
    // PENTING: Pastikan ini selalu array saat reset
    setAdditionalImages(
      Array.isArray(initialData?.additional_images)
        ? initialData.additional_images
        : []
    );
    setErrors(null);
  }, [initialData]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (!initialData) {
      setSlug(generateSlug(name));
    }
  }, [name, initialData]);

  const handleMainImageSelect = (url: string | null) => {
    setFinalImageUrl(url);
  };

  const handleAdditionalImageSelect = (url: string | null) => {
    setAdditionalImages((prevImages) => {
      if (
        currentAdditionalImageIndex !== null &&
        prevImages[currentAdditionalImageIndex] !== undefined
      ) {
        // Edit gambar yang sudah ada
        const newImages = [...prevImages];
        if (url) {
          newImages[currentAdditionalImageIndex] = url;
        } else {
          // Hapus jika URL null
          newImages.splice(currentAdditionalImageIndex, 1);
        }
        return newImages;
      } else if (url) {
        // Tambah gambar baru
        return [...prevImages, url];
      }
      return prevImages;
    });
    setShowAdditionalImageModal(false);
    setCurrentAdditionalImageIndex(null);
  };

  const handleAddAdditionalImage = () => {
    setCurrentAdditionalImageIndex(null);
    setShowAdditionalImageModal(true);
  };

  const handleEditAdditionalImage = (index: number) => {
    setCurrentAdditionalImageIndex(index);
    setShowAdditionalImageModal(true);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    formData.set("slug", slug);
    formData.set("image_url", finalImageUrl || "");
    formData.set("order_index", orderIndex.toString());
    formData.set("additional_images", JSON.stringify(additionalImages));

    let result;
    if (initialData?.id) {
      result = await updateMenuItem(initialData.id, formData);
    } else {
      result = await createMenuItem(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      router.push("/mudir/menus");
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
      {/* Basic Details */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Nama Menu
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Slug (URL Friendly)
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading || !!initialData}
        />
        {errors?.slug && (
          <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        ></textarea>
        {errors?.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Harga
        </label>
        <input
          type="number"
          id="price"
          name="price"
          step="any"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>
        )}
      </div>

      {/* --- Gambar Utama --- */}
      <div className="my-6">
        <label className="block text-sm font-body text-deep-mocha mb-2">
          Gambar Utama Menu
        </label>
        <AssetManager
          onAssetSelect={handleMainImageSelect}
          initialAssetUrl={initialData?.image_url}
          allowedFileTypes="image/*"
          bucketName="assets"
          fileInputLabel="Pilih gambar utama untuk menu"
        />
      </div>

      {/* --- Gambar Tambahan --- */}
      <div className="my-6 border border-warm-brown rounded-lg p-4 bg-light-cream">
        <h3 className="text-lg font-display lowercase text-deep-mocha mb-4">
          gambar tambahan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {/* PENTING: Pastikan additionalImages selalu array sebelum memanggil .map() */}
          {/* Menggunakan Array.isArray untuk verifikasi runtime */}
          {(Array.isArray(additionalImages) ? additionalImages : []).map(
            (imgUrl, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden border border-clay-pink shadow-sm group"
              >
                <Image
                  src={imgUrl}
                  alt={`Gambar tambahan ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-deep-mocha bg-opacity-70 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleEditAdditionalImage(index)}
                    className="p-2 rounded-full bg-light-cream text-deep-mocha hover:bg-clay-pink transition-colors"
                    aria-label="Edit gambar tambahan"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalImage(index)}
                    className="p-2 rounded-full bg-red-500 text-light-cream hover:bg-red-600 transition-colors"
                    aria-label="Hapus gambar tambahan"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          )}
          {/* Tombol Tambah Gambar */}
          <button
            type="button"
            onClick={handleAddAdditionalImage}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-warm-brown rounded-lg text-warm-brown hover:border-deep-mocha hover:text-deep-mocha transition-colors aspect-square"
          >
            <PlusCircleIcon className="h-8 w-8 mb-2" />
            <span className="text-sm font-body">Tambah Gambar</span>
          </button>
        </div>
        {errors?.additional_images && (
          <p className="text-red-500 text-xs mt-1">
            {errors.additional_images[0]}
          </p>
        )}
      </div>

      {/* Modal untuk AssetManager Gambar Tambahan */}
      {showAdditionalImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-light-cream p-6 rounded-lg shadow-2xl w-full max-w-2xl relative">
            <h3 className="text-xl font-display lowercase text-deep-mocha mb-4">
              {currentAdditionalImageIndex !== null
                ? "edit gambar tambahan"
                : "pilih gambar tambahan"}
            </h3>
            <AssetManager
              onAssetSelect={handleAdditionalImageSelect}
              initialAssetUrl={
                currentAdditionalImageIndex !== null
                  ? additionalImages[currentAdditionalImageIndex]
                  : null
              }
              allowedFileTypes="image/*"
              bucketName="assets"
              fileInputLabel="Pilih atau upload gambar tambahan"
            />
            <button
              type="button"
              onClick={() => setShowAdditionalImageModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-warm-brown text-light-cream hover:bg-clay-pink hover:text-deep-mocha"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {/* End Modal */}

      {/* Other Details */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Kategori
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          required
          disabled={loading}
        />
        {errors?.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>
        )}
      </div>

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
          id="is_available"
          name="is_available"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="h-4 w-4 text-deep-mocha focus:ring-deep-mocha border-warm-brown rounded"
          disabled={loading}
        />
        <label
          htmlFor="is_available"
          className="ml-2 block text-sm font-body text-deep-mocha"
        >
          Tersedia
        </label>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/mudir/menus")}
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
          {loading
            ? initialData
              ? "Menyimpan..."
              : "Menambahkan..."
            : initialData
            ? "Simpan Perubahan"
            : "Tambah Menu"}
        </button>
      </div>
    </form>
  );
}
