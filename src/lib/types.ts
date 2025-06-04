// src/lib/types.ts
export type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type CarouselSlide = {
  id: string;
  image_url: string;
  alt_text: string;
  headline: string;
  body_text: string | null;
  button_text: string | null;
  button_link: string | null;
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
