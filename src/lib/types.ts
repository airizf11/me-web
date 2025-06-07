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
  additional_images?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type MenuCategory = {
  name: string;
  count: number;
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

export type Transaction = {
  id: string;
  transaction_timestamp: string;
  total_amount: number;
  platform_source: string;
  notes: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_ig_username: string | null;
  customer_food_delivery_id: string | null;
  delivery_city: string | null;
  delivery_district: string | null;
  is_delivery: boolean;
  is_pickup: boolean;
  screenshot_url: string | null;
  type: "sale" | "purchase";
  status: string;
  purchase_items_json?: PurchaseItem[] | null;
  created_at: string;
  updated_at: string;
  items?: TransactionItem[];
};

export type TransactionItem = {
  id: string;
  transaction_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_transaction: number;
  created_at: string;
  menu_item?: MenuItem;
};

export type PurchaseItem = {
  id?: string; // ID unik lokal untuk UI
  type: "raw_material" | "custom"; // Tipe item
  raw_material_id?: string; // Opsional: hanya jika type='raw_material'
  raw_material_name: string; // Nama bahan baku/item
  quantity: number;
  unit: string; // Satuan pembelian
  unit_price: number; // Harga satuan saat pembelian
  subtotal?: number; // Total harga per item
  custom_description?: string; // Deskripsi tambahan untuk item kustom
  custom_category?: string;
};

export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
  last_purchase_price: number | null;
  supplier: string | null;
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
