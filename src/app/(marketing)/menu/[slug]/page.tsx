// src/app/(marketing)/menu/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMenuItemBySlug } from "@/lib/actions/menu";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AddToCartButton } from "@/components/marketing/AddToCartButton";

function GradientDivider({
  topColor,
  bottomColor,
}: {
  topColor: string;
  bottomColor: string;
}) {
  const getHexColor = (tailwindClass: string) => {
    switch (tailwindClass) {
      case "bg-light-cream":
        return "#EFE9E4";
      case "bg-warm-brown":
        return "#A1887F";
      case "bg-deep-mocha":
        return "#6D4C41";
      case "bg-clay-pink":
        return "#DAB5A3";
      default:
        return "#FFFFFF";
    }
  };

  const topHex = getHexColor(topColor);
  const bottomHex = getHexColor(bottomColor);

  return (
    <div
      className="w-full h-16 -mt-16 relative z-0"
      style={{
        background: `linear-gradient(to bottom, ${topHex}, ${bottomHex})`,
      }}
    ></div>
  );
}

interface MenuDetailsPageProps {
  params?: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: MenuDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Detail Menu - Menurutmu",
      description: "Halaman detail menu minuman Menurutmu.",
    };
  }

  const { data: menuItem } = await getMenuItemBySlug(slug);

  return {
    title: menuItem
      ? `${menuItem.name} - Menurutmu`
      : "Detail Menu - Menurutmu",
    description: menuItem
      ? `Detail ${menuItem.name}: ${menuItem.description}`
      : "Halaman detail menu minuman Menurutmu.",
  };
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
    return null;
  }

  const { data: menuItem, error } = await getMenuItemBySlug(slug);

  if (error || !menuItem) {
    console.error("Error fetching menu item by slug:", error);
    notFound();
    return null;
  }

  const heroProductData = {
    imageUrl: menuItem.image_url || "/images/menu-placeholder.jpg",
    altText: menuItem.name || "Gambar produk menu",
    headline: menuItem.name,
    bodyText:
      menuItem.description || "Sebuah sajian reflektif untuk menemani momenmu.",
    ctaText: `Pesan ${menuItem.name}`,
    ctaLink: "/checkout",
    brandName: "menurutmu",
  };

  return (
    <>
      <HeroSection
        imageUrl={heroProductData.imageUrl}
        altText={heroProductData.altText}
        headline={heroProductData.headline}
        bodyText={heroProductData.bodyText}
        ctaText={heroProductData.ctaText}
        ctaLink={heroProductData.ctaLink}
        brandName={heroProductData.brandName}
      />
      <GradientDivider topColor="bg-deep-mocha" bottomColor="bg-light-cream" />
      <section className="bg-light-cream py-16 px-8 relative z-10">
        <div className="container mx-auto text-deep-mocha max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-display lowercase mb-2">
                Detail Produk
              </h2>
              <p className="text-xl font-body font-semibold text-deep-mocha">
                {menuItem.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
              <p className="text-base font-body leading-relaxed text-warm-brown">
                {menuItem.description ||
                  "Deskripsi lebih lanjut akan segera ditambahkan."}
              </p>

              <div className="flex items-center space-x-3 text-sm font-body mt-4">
                <span className="bg-deep-mocha text-light-cream px-3 py-1 rounded-full">
                  {menuItem.category}
                </span>
                {menuItem.is_available ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Tersedia
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    Tidak Tersedia
                  </span>
                )}
              </div>

              <div className="mt-8">
                <div className="mt-auto">
                  <AddToCartButton item={menuItem} className="w-full text-lg" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display lowercase mb-2">
                Foto Produk
              </h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-warm-brown bg-clay-pink flex items-center justify-center text-warm-brown">
                <p>Gambar Tambahan</p>
                <Image
                  src="/images/additional-product-shot.jpg"
                  alt="Additional view"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Bisa tambah section Nutrisi, Review dll */}
            </div>
          </div>
        </div>
      </section>
      <GradientDivider topColor="bg-light-cream" bottomColor="bg-deep-mocha" />{" "}
      <section className="bg-deep-mocha py-8 px-8 text-center">
        {" "}
        <Link
          href="/menu"
          className="text-light-cream hover:text-warm-brown transition-colors font-body text-md flex items-center justify-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Kembali ke Daftar Menu
        </Link>
      </section>
    </>
  );
}
