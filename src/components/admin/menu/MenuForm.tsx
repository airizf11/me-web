// src/components/admin/menu/MenuForm.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { type MenuItem } from "@/lib/types";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu"; // Import Server Actions

type MenuFormProps = {
  initialData?: MenuItem | null; // Untuk mode edit, berisi data menu yang akan diedit
  onFormSubmitSuccess: () => void; // Callback setelah form berhasil disubmit
  onCancel: () => void; // Callback saat form dibatalkan
};

export function MenuForm({
  initialData,
  onFormSubmitSuccess,
  onCancel,
}: MenuFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );

  // State lokal untuk form input (jika ingin controlled components)
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [category, setCategory] = useState(initialData?.category || "Coffee");
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available ?? true
  );

  useEffect(() => {
    // Reset form state ketika initialData berubah (misal dari "tambah" ke "edit" atau sebaliknya)
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || 0);
    setImageUrl(initialData?.image_url || "");
    setCategory(initialData?.category || "Coffee");
    setIsAvailable(initialData?.is_available ?? true);
    setErrors(null); // Bersihkan error
  }, [initialData]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    let result;
    if (initialData?.id) {
      // Mode Edit
      result = await updateMenuItem(initialData.id, formData);
    } else {
      // Mode Tambah
      result = await createMenuItem(formData);
    }

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset(); // Reset form jika berhasil
      onFormSubmitSuccess(); // Panggil callback sukses
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
          step="0.01" // Untuk harga desimal
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

      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          URL Gambar
        </label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        />
        {errors?.image_url && (
          <p className="text-red-500 text-xs mt-1">{errors.image_url[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading}
        >
          <option value="Coffee">Coffee</option>
          <option value="Non-Coffee">Non-Coffee</option>
          <option value="Seasonal">Seasonal</option>
          {/* Tambah kategori lain sesuai kebutuhan */}
        </select>
        {errors?.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>
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
          onClick={onCancel}
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
