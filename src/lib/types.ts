// src/lib/types.ts
export type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Menggunakan number karena dari database numeric
  image_url: string | null; // Bisa null jika tidak ada gambar
  category: string;
  is_available: boolean;
  order_index: number;
  created_at: string; // ISO string
  updated_at: string; // ISO string
};

export type CarouselSlide = {
  id: string;
  image_url: string;
  alt_text: string;
  headline: string;
  body_text: string | null; // Bisa null jika tidak ada body text
  button_text: string | null; // Bisa null jika tidak ada tombol
  button_link: string | null; // Bisa null jika tidak ada tombol
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string | null;
  source_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
