// src/app/(marketing)/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { Carousel } from "@/components/Carousel";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type CarouselSlide, type MenuItem } from "@/lib/types";
import Link from "next/link";
import { GradientDivider } from "@/components/marketing/GradientDivider";
import { HomepageMenuItemCard } from "@/components/marketing/HomepageMenuItemCard";

export const metadata: Metadata = {
  title: "Menurutmu - Refleksi di Setiap Tegukan",
  description:
    "Brand minuman reflektif yang mengajak konsumen berpikir dan berdialog. Temukan kopi dan minuman favoritmu untuk menemani momen perenungan.",
  keywords: [
    "kopi",
    "reflektif",
    "minuman",
    "menurutmu",
    "kopi surabaya",
    "kedai kopi",
  ],
  openGraph: {
    title: "Menurutmu - Refleksi di Setiap Tegukan",
    description:
      "Lebih dari sekadar minuman, kami adalah teman berpikirmu. Hangat, tenang, dan personal.",
    url: "https://menurutmu.vercel.app",
    siteName: "Menurutmu",
    images: [
      {
        url: "https://menurutmu.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo Menurutmu dengan secangkir kopi",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

async function getHomepageData() {
  const supabase = await createServerSupabaseClient();

  const [
    heroSlidesResult,
    topMenusResult,
    newMenusResult,
    carouselSlidesResult,
  ] = await Promise.all([
    supabase
      .from("carousel_slides")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true }),
    supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("order_index", { ascending: true })
      .limit(3),
    supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("carousel_slides")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true }),
  ]);

  if (heroSlidesResult.error)
    console.error(
      "Error fetching hero slides:",
      heroSlidesResult.error.message
    );
  if (topMenusResult.error)
    console.error("Error fetching top menus:", topMenusResult.error.message);
  if (newMenusResult.error)
    console.error("Error fetching new menus:", newMenusResult.error.message);
  if (carouselSlidesResult.error)
    console.error(
      "Error fetching carousel slides:",
      carouselSlidesResult.error.message
    );

  let heroSlide: CarouselSlide | null = null;
  if (heroSlidesResult.data && heroSlidesResult.data.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * heroSlidesResult.data.length
    );
    heroSlide = heroSlidesResult.data[randomIndex] as CarouselSlide;
  }

  return {
    heroSlide,
    topMenus: (topMenusResult.data as MenuItem[]) || [],
    newComingMenus: (newMenusResult.data as MenuItem[]) || [],
    carouselSlides: (carouselSlidesResult.data as CarouselSlide[]) || [],
  };
}

export default async function HomePage() {
  const { heroSlide, topMenus, newComingMenus, carouselSlides } =
    await getHomepageData();

  const defaultHero = {
    imageUrl: "/images/hero-default.jpg",
    altText:
      "Sebuah cangkir kopi dengan latar belakang reflektif dan pemandangan tenang",
    headline: "Satu Tegukan, Seribu Makna",
    bodyText: "Temukan inspirasi dan kedamaian di setiap momen bersamamu.",
    ctaText: "Jelajahi Menu",
    ctaLink: "/menu",
  };

  const finalHeroData = {
    imageUrl: heroSlide?.image_url || defaultHero.imageUrl,
    altText: heroSlide?.alt_text || defaultHero.altText,
    headline: heroSlide?.headline || defaultHero.headline,
    bodyText: heroSlide?.body_text || defaultHero.bodyText,
    ctaText: heroSlide?.button_text || defaultHero.ctaText,
    ctaLink: heroSlide?.button_link || defaultHero.ctaLink,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Menurutmu",
    description:
      "Brand minuman reflektif yang tidak sekadar menyegarkan, tapi juga mengajak konsumen berpikir dan berdialog.",
    url: "https://menurutmu.vercel.app",
    logo: "https://menurutmu.vercel.app/logo.png",
    telephone: "+6283113156507",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Bendul Merisi Selatan V",
      addressLocality: "Surabaya",
      addressRegion: "Jawa Timur",
      postalCode: "60239",
      addressCountry: "ID",
    },
    servesCuisine: "Kopi, Minuman",
    priceRange: "Rp15.000 - Rp30.000",
    sameAs: [
      "https://www.instagram.com/me_nurutmu",
      "https://www.tiktok.com/@me_nurutmu",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection
        imageUrl={finalHeroData.imageUrl}
        altText={finalHeroData.altText}
        headline={finalHeroData.headline}
        bodyText={finalHeroData.bodyText}
        ctaText={finalHeroData.ctaText}
        ctaLink={finalHeroData.ctaLink}
        brandName="menurutmu"
      />

      <section className="bg-light-cream py-16 px-4 sm:px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-deep-mocha mb-8">
            teman berpikirmu
          </h2>
          <p className="text-lg font-body text-warm-brown max-w-3xl mx-auto mb-12">
            "Menurutmu" lebih dari sekadar minuman. Ini adalah jeda di tengah
            rutinitas, adalah pertanyaan yang menggugah, adalah inspirasi yang
            menenangkan. Hangat, tenang, dan personal — teman terbaik untuk
            setiap refleksi.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-deep-mocha text-light-cream rounded-full font-body text-xl hover:bg-warm-brown transition-colors shadow-lg"
          >
            Lihat Semua Menu
          </Link>
        </div>
      </section>

      <GradientDivider
        topColorClass="bg-light-cream"
        bottomColorClass="bg-warm-brown"
      />

      <section className="bg-warm-brown py-16 px-4 sm:px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-light-cream mb-12">
            Menu Terfavorit
          </h2>
          {topMenus.length === 0 ? (
            <p className="text-light-cream/70 font-body">
              Belum ada menu terfavorit yang ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {topMenus.map((menu) => (
                <HomepageMenuItemCard key={menu.id} item={menu} />
              ))}
            </div>
          )}
          <div className="mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-4 bg-light-cream text-deep-mocha rounded-full font-body text-xl hover:bg-clay-pink transition-colors shadow-lg"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>

      <GradientDivider
        topColorClass="bg-warm-brown"
        bottomColorClass="bg-light-cream"
      />

      <section className="bg-light-cream py-16 px-4 sm:px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-deep-mocha mb-12">
            Lebih Banyak Makna
          </h2>
          <Carousel slides={carouselSlides} />
        </div>
      </section>

      <GradientDivider
        topColorClass="bg-light-cream"
        bottomColorClass="bg-warm-brown"
      />

      <section className="bg-warm-brown py-16 px-4 sm:px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-light-cream mb-12">
            Menu Terbaru
          </h2>
          {newComingMenus.length === 0 ? (
            <p className="text-light-cream/70 font-body">
              Belum ada menu terbaru yang ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {newComingMenus.map((menu) => (
                <HomepageMenuItemCard key={menu.id} item={menu} />
              ))}
            </div>
          )}
          <div className="mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-4 bg-light-cream text-deep-mocha rounded-full font-body text-xl hover:bg-clay-pink transition-colors shadow-lg"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
