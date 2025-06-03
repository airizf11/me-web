// src/components/admin/menu/MenuForm.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { type MenuItem } from "@/lib/types";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu";
import { useRouter } from "next/navigation";
import { AssetManager } from "@/components/admin/AssetManager";

type MenuFormProps = {
  initialData?: MenuItem | null;
};

export function MenuForm({ initialData }: MenuFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false); // Untuk tombol submit utama
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
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0); // Tambahkan state orderIndex

  useEffect(() => {
    setName(initialData?.name || "");
    setSlug(initialData?.slug || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || 0);
    setFinalImageUrl(initialData?.image_url || null);
    setCategory(initialData?.category || "Coffee");
    setIsAvailable(initialData?.is_available ?? true);
    setOrderIndex(initialData?.order_index || 0); // Reset orderIndex
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

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    formData.set("slug", slug);
    formData.set("image_url", finalImageUrl || "");
    formData.set("order_index", orderIndex.toString()); // Tambahkan order_index ke formData

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

      {/* --- Integrasi AssetManager --- */}
      <div className="my-6">
        <label className="block text-sm font-body text-deep-mocha mb-2">
          Gambar Menu
        </label>
        <AssetManager
          onAssetSelect={setFinalImageUrl}
          initialAssetUrl={initialData?.image_url}
          allowedFileTypes="image/*"
          bucketName="assets"
          fileInputLabel="Pilih gambar untuk menu"
        />
      </div>
      {/* --- Akhir Integrasi AssetManager --- */}

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

      {/* Field Order Index */}
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
          onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)} // Parse ke integer
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
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-light-cream rounded-full"></span>
              {initialData ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Menu"
          )}
        </button>
      </div>
    </form>
  );
}
