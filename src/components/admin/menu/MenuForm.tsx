// src/components/admin/menu/MenuForm.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image"; // PENTING: Tambahkan import ini
import toast from "react-hot-toast";
import { type MenuItem } from "@/lib/types";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu";
import { useRouter } from "next/navigation";
// import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'; // Tidak diperlukan jika tidak dipakai

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

  // State lokal untuk form input
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [category, setCategory] = useState(initialData?.category || "Coffee"); // Default 'Coffee'
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available ?? true
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );

  useEffect(() => {
    setName(initialData?.name || "");
    setSlug(initialData?.slug || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || 0);
    setImageUrl(initialData?.image_url || "");
    setCategory(initialData?.category || "Coffee");
    setIsAvailable(initialData?.is_available ?? true);
    setErrors(null);
    setSelectedFile(null);
    setImagePreview(initialData?.image_url || null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(""); // Kosongkan URL manual jika file dipilih
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(null);
    toast.dismiss();

    formData.set("slug", slug);

    // Jika ada file yang dipilih, tambahkan ke formData (untuk proses upload nanti)
    if (selectedFile) {
      formData.append("image_file", selectedFile);
    } else if (imageUrl) {
      // Jika tidak ada file baru tapi ada URL manual, pastikan terkirim
      formData.set("image_url", imageUrl);
    } else {
      // Jika tidak ada file dan tidak ada URL manual, set image_url ke null
      formData.set("image_url", ""); // Zod akan menganggap string kosong sebagai valid, jadi kita set null di server action
    }

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

      {/* --- Bagian Upload Gambar --- */}
      <div>
        <label
          htmlFor="image_upload"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Upload Gambar
        </label>
        <input
          type="file"
          id="image_upload"
          name="image_upload" // Nama ini akan digunakan di Server Action untuk mengambil file
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-deep-mocha text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-clay-pink file:text-deep-mocha hover:file:bg-warm-brown hover:file:text-light-cream file:transition-colors file:duration-200"
          disabled={loading}
        />
        {(imagePreview || imageUrl) && ( // Tampilkan preview jika ada file dipilih atau URL manual
          <div className="mt-4 relative w-32 h-32 rounded-md overflow-hidden border border-warm-brown shadow-sm">
            <Image
              src={imagePreview || imageUrl || ""} // Gunakan imagePreview jika ada, kalau tidak imageUrl
              alt="Preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        {errors?.image_url && (
          <p className="text-red-500 text-xs mt-1">{errors.image_url[0]}</p>
        )}
      </div>

      <div className="text-center text-sm text-warm-brown my-2">-- ATAU --</div>
      <div>
        <label
          htmlFor="image_url_manual"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          URL Gambar Manual (Opsional)
        </label>
        <input
          type="url"
          id="image_url_manual" // ID baru untuk membedakan dengan input file
          name="image_url" // Tetap gunakan name="image_url" agar Server Action bisa menangkapnya
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setSelectedFile(null);
            setImagePreview(null);
          }} // Reset file/preview jika URL manual diisi
          className="w-full p-2 border border-warm-brown rounded-md bg-light-cream text-deep-mocha focus:ring-deep-mocha focus:border-deep-mocha"
          disabled={loading || !!selectedFile} // Nonaktifkan jika ada file yang dipilih
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-body text-deep-mocha mb-1"
        >
          Kategori
        </label>
        <input // Ganti dari select ke input type="text"
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
