// src/lib/promoHelper.ts
import { type MenuItem, type Promo } from "@/lib/types";

export function getDiscountedPrice(
  menuItem: MenuItem,
  activePromos: Promo[]
): number | null {
  let discountedPrice: number | null = null;
  const originalPrice = menuItem.price;

  const itemSpecificPromo = activePromos.find(
    (p) => p.target_type === "menu_item" && p.target_ids?.includes(menuItem.id)
  );
  const categoryPromo = activePromos.find(
    (p) =>
      p.target_type === "category" && p.target_ids?.includes(menuItem.category)
  );
  const allItemsPromo = activePromos.find((p) => p.target_type === "all");

  const promoToApply = itemSpecificPromo || categoryPromo || allItemsPromo;

  if (promoToApply) {
    if (
      promoToApply.min_order_amount &&
      originalPrice < promoToApply.min_order_amount
    ) {
      return null;
    }

    if (promoToApply.type === "percentage") {
      discountedPrice = originalPrice * (1 - promoToApply.value / 100);
    } else if (promoToApply.type === "fixed_amount") {
      discountedPrice = originalPrice - promoToApply.value;
    }
    // Logika BOGO bisa ditangani di level keranjang
  }

  if (discountedPrice !== null && discountedPrice < 0) {
    return 0;
  }

  if (discountedPrice !== null && discountedPrice >= originalPrice) {
    return null;
  }

  return discountedPrice;
}
