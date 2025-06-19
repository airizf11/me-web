// src/app/(marketing)/menu/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/marketing/AddToCartButton";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ProductImageGallery } from "@/components/marketing/ProductImageGallery";
import { HomepageMenuItemCard } from "@/components/marketing/HomepageMenuItemCard";
import { PageHeader } from "@/components/marketing/PageHeader";
import { GradientDivider } from "@/components/marketing/GradientDivider";
import { type Quote, type MenuItem } from "@/lib/types";

async function getPageData(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: menuItem, error } = await supabase
    .from("menus")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !menuItem) {
    console.error(
      `Error fetching menu item for slug "${slug}":`,
      error?.message
    );
    return { menuItem: null, randomQuote: null, relatedMenus: [] };
  }

  const { data: quotes } = await supabase
    .from("quotes")
    .select("text, author")
    .eq("is_active", true);
  const randomQuote =
    quotes && quotes.length > 0
      ? (quotes[Math.floor(Math.random() * quotes.length)] as Pick<
          Quote,
          "text" | "author"
        >)
      : null;

  const { data: relatedMenus } = await supabase
    .from("menus")
    .select("*")
    .eq("category", menuItem.category)
    .neq("slug", slug)
    .eq("is_available", true)
    .limit(3);

  return {
    menuItem,
    randomQuote,
    relatedMenus: (relatedMenus as MenuItem[]) || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { menuItem } = await getPageData(slug);
  if (!menuItem) return { title: "Menu Tidak Ditemukan" };
  return {
    title: `${menuItem.name} - Menurutmu`,
    description:
      menuItem.description ||
      `Detail dan informasi harga untuk ${menuItem.name}.`,
    openGraph: {
      title: `${menuItem.name} - Menurutmu`,
      description:
        menuItem.description || "Temukan momen reflektifmu dengan sajian ini.",
      images: [
        {
          url:
            menuItem.image_url || "https://menurutmu.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: menuItem.name,
        },
      ],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const supabase = createServiceSupabaseClient();
  const { data: menus } = await supabase
    .from("menus")
    .select("slug")
    .eq("is_available", true);
  if (!menus) return [];
  return menus.map((menu) => ({ slug: menu.slug }));
}

export default async function MenuDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { menuItem, randomQuote, relatedMenus } = await getPageData(slug);

  if (!menuItem) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: menuItem.name,
    image: menuItem.image_url,
    description: menuItem.description,
    sku: menuItem.id,
    brand: { "@type": "Brand", name: "Menurutmu" },
    offers: {
      "@type": "Offer",
      url: `https://menurutmu.vercel.app/menu/${menuItem.slug}`,
      priceCurrency: "IDR",
      price: menuItem.price,
      availability: menuItem.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const validAdditionalImages = Array.isArray(menuItem.additional_images)
    ? menuItem.additional_images.filter(
        (img: string) =>
          typeof img === "string" &&
          (img.startsWith("http") || img.startsWith("/"))
      )
    : null;

  return (
    <div className="bg-light-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        <PageHeader
          title={menuItem.name}
          subtitle={
            menuItem.description ||
            "Sebuah sajian reflektif untuk menemani momenmu."
          }
        />
      </section>

      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mt-12">
          {/* KOLOM KIRI: GALERI GAMBAR */}
          <div className="lg:sticky top-28 h-full">
            <ProductImageGallery
              mainImage={menuItem.image_url || "/images/menu-placeholder.jpg"}
              additionalImages={validAdditionalImages}
              altText={menuItem.name}
            />
          </div>

          {/* KOLOM KANAN: DETAIL PRODUK */}
          <div className="flex flex-col">
            {/* ==================================================== */}
            {/* DETAIL KATEGORI & STATUS KETERSEDIAAN */}
            {/* ==================================================== */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-clay-pink/50 text-deep-mocha px-3 py-1 rounded-full text-sm font-semibold">
                {menuItem.category}
              </span>
              {menuItem.is_available ? (
                <span className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <CheckCircleIcon className="h-5 w-5" />
                  Tersedia
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <XCircleIcon className="h-5 w-5" />
                  Stok Habis
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-display lowercase text-deep-mocha mt-1 mb-4 sr-only">
              {menuItem.name}
            </h1>

            <div className="text-3xl font-body font-semibold text-deep-mocha mb-8">
              {menuItem.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </div>

            <div className="mt-auto">
              <AddToCartButton
                item={menuItem}
                className="w-full py-4 text-lg disabled:opacity-70 disabled:bg-gray-400"
                text={
                  menuItem.is_available ? "Tambah ke Keranjang" : "Stok Habis"
                }
              />
            </div>

            {randomQuote && (
              <div className="mt-10 border-t-2 border-dashed border-clay-pink pt-8 text-center">
                <p className="text-xl font-display italic text-deep-mocha">
                  “{randomQuote.text}”
                </p>
                {randomQuote.author && (
                  <p className="mt-3 text-sm font-body text-warm-brown">
                    — {randomQuote.author}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedMenus.length > 0 && (
        <>
          <GradientDivider
            topColorClass="bg-light-cream"
            bottomColorClass="bg-warm-brown"
          />
          <section className="bg-warm-brown py-16">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-display lowercase text-light-cream text-center mb-10">
                Mungkin kamu juga suka
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedMenus.map((menu) => (
                  <HomepageMenuItemCard key={menu.id} item={menu} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-light-cream py-8 text-center">
        <Link
          href="/menu"
          className="text-sm font-medium text-deep-mocha hover:text-warm-brown flex items-center justify-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Kembali ke Semua Menu
        </Link>
      </section>
    </div>
  );
}
