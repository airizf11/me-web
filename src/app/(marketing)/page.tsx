// src/app/(marketing)/page.tsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { Carousel } from "@/components/Carousel";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type CarouselSlide, type MenuItem } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Menurutmu - Refleksi di Setiap Tegukan",
  description:
    "Brand minuman reflektif yang mengajak konsumen berpikir dan berdialog.",
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  let heroSlide: CarouselSlide | null = null;
  let topMenus: MenuItem[] = [];
  let newComingMenus: MenuItem[] = [];

  try {
    const { data: slidesData, error: slideError } = await supabase
      .from("carousel_slides")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (slideError && slideError.code !== "PGRST116") {
      console.error(
        "Error fetching hero slides for random selection:",
        slideError.message
      );
    } else {
      if (slidesData && slidesData.length > 0) {
        const randomIndex = Math.floor(Math.random() * slidesData.length);
        heroSlide = slidesData[randomIndex] as CarouselSlide;
      }
    }

    const { data: topMenusData, error: topMenusError } = await supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("order_index", { ascending: true })
      .limit(3);

    if (topMenusError) {
      console.error("Error fetching top menus:", topMenusError.message);
    } else {
      topMenus = topMenusData as MenuItem[];
    }

    const { data: newComingMenusData, error: newComingMenusError } =
      await supabase
        .from("menus")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(3);

    if (newComingMenusError) {
      console.error(
        "Error fetching new coming menus:",
        newComingMenusError.message
      );
    } else {
      newComingMenus = newComingMenusData as MenuItem[];
    }
  } catch (err: any) {
    console.error("Unexpected error during homepage data fetch:", err.message);
  }

  const defaultHero = {
    imageUrl: "/images/hero-default.jpg",
    altText:
      "Sebuah cangkir kopi dengan latar belakang reflektif dan pemandangan tenang",
    headline: "Satu Tegukan, Seribu Makna",
    bodyText: "Temukan inspirasi dan kedamaian di setiap momen bersamamu.",
    button_text: "Jelajahi Menu",
    button_link: "/menu",
  };

  const finalHeroData = {
    imageUrl: heroSlide?.image_url || defaultHero.imageUrl,
    altText: heroSlide?.alt_text || defaultHero.altText,
    headline: heroSlide?.headline || defaultHero.headline,
    bodyText: heroSlide?.body_text || defaultHero.bodyText,
    ctaText: heroSlide?.button_text || defaultHero.button_text,
    ctaLink: heroSlide?.button_link || defaultHero.button_link,
  };
  if (!finalHeroData.imageUrl) finalHeroData.imageUrl = defaultHero.imageUrl;
  if (!finalHeroData.altText) finalHeroData.altText = defaultHero.altText;

  if (topMenus.length === 0) {
    console.warn(
      "No top menus found, consider adding some or adjusting criteria."
    );
  }
  if (newComingMenus.length === 0) {
    console.warn(
      "No new coming menus found, consider adding some or adjusting criteria."
    );
  }

  return (
    <>
      <HeroSection
        imageUrl={finalHeroData.imageUrl}
        altText={finalHeroData.altText}
        headline={finalHeroData.headline}
        bodyText={finalHeroData.bodyText}
        ctaText={finalHeroData.ctaText}
        ctaLink={finalHeroData.ctaLink}
        brandName="menurutmu"
      />

      <section className="bg-light-cream py-16 px-8 relative z-10">
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

      <div
        className="w-full h-16 -mt-16 relative z-0"
        style={{
          background: "linear-gradient(to bottom, #EFE9E4, #A1887F)",
        }}
      ></div>

      <section className="bg-warm-brown py-16 px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-light-cream mb-12">
            Menu Terfavorit
          </h2>
          {topMenus.length === 0 ? (
            <p className="text-light-cream/70 font-body">
              Belum ada menu terfavorit yang ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topMenus.map((menu) => (
                <Link
                  href={`/menu/${menu.slug}`}
                  key={menu.id}
                  className="block group"
                >
                  <div className="bg-light-cream rounded-lg shadow-lg overflow-hidden transition-transform transform group-hover:scale-105 duration-300">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={menu.image_url || "/images/menu-placeholder.jpg"}
                        alt={menu.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="group-hover:brightness-90 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 text-deep-mocha">
                      <h3 className="text-xl font-display lowercase truncate">
                        {menu.name}
                      </h3>
                      <p className="text-lg font-body mt-2">
                        {menu.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
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

      <div
        className="w-full h-16 -mt-16 relative z-0"
        style={{
          background: "linear-gradient(to bottom, #A1887F, #EFE9E4)",
        }}
      ></div>

      <section className="bg-light-cream py-16 px-8 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-display lowercase text-deep-mocha mb-12 text-center">
            Lebih Banyak Makna
          </h2>
          <Carousel />
        </div>
      </section>

      <div
        className="w-full h-16 -mt-16 relative z-0"
        style={{
          background: "linear-gradient(to bottom, #EFE9E4, #A1887F)",
        }}
      ></div>

      <section className="bg-warm-brown py-16 px-8 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display lowercase text-light-cream mb-12">
            Menu Terbaru
          </h2>
          {newComingMenus.length === 0 ? (
            <p className="text-light-cream/70 font-body">
              Belum ada menu terbaru yang ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newComingMenus.map((menu) => (
                <Link
                  href={`/menu/${menu.slug}`}
                  key={menu.id}
                  className="block group"
                >
                  <div className="bg-light-cream rounded-lg shadow-lg overflow-hidden transition-transform transform group-hover:scale-105 duration-300">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={menu.image_url || "/images/menu-placeholder.jpg"}
                        alt={menu.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="group-hover:brightness-90 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 text-deep-mocha">
                      <h3 className="text-xl font-display lowercase truncate">
                        {menu.name}
                      </h3>
                      <p className="text-lg font-body mt-2">
                        {menu.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
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
