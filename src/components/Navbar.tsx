// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

export function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0); // Menyimpan tinggi HeroSection setelah mount
  const pathname = usePathname();

  useEffect(() => {
    // Pastikan ini hanya berjalan di klien
    setHeroHeight(window.innerHeight); // HeroSection biasanya setinggi viewport (h-screen)

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const scrollThreshold = heroHeight * 0.7; // 70% dari tinggi HeroSection

  // Hitung opasitas (alpha value untuk rgba)
  const opacity = isHomePage
    ? Math.min(1, scrollY / scrollThreshold) // 0 saat scrollY=0, 1 saat scrollY >= threshold
    : 1; // Selalu 1 (padat) di halaman lain

  // Warna dasar Navbar (deep-mocha: #6D4C41)
  const baseColor = { r: 109, g: 76, b: 65 }; // Hex #6D4C41

  // Background Navbar dinamis
  const navbarBg = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity})`;

  // Warna teks/logo/tombol dinamis berdasarkan opasitas
  const isSolid = opacity > 0.5; // Jika opasitas sudah cukup tinggi, anggap padat
  const textColor =
    isHomePage && !isSolid ? "text-light-cream" : "text-light-cream"; // Warna teks selalu putih di navbar gelap
  const hoverTextColor =
    isHomePage && !isSolid ? "hover:text-clay-pink" : "hover:text-warm-brown";

  const buttonBgColor =
    isHomePage && !isSolid ? "bg-light-cream" : "bg-clay-pink";
  const buttonTextColor =
    isHomePage && !isSolid ? "text-deep-mocha" : "text-deep-mocha";
  const buttonHoverBgColor =
    isHomePage && !isSolid ? "hover:bg-clay-pink" : "hover:bg-warm-brown";

  return (
    <Popover
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300", // Hanya transisi shadow
        scrollY >= scrollThreshold && "shadow-md"
      )}
      style={{
        backgroundColor: navbarBg, // Gunakan background rgba dinamis
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
          {/* Logo Brand */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link
              href="/"
              className={clsx("transition-colors", textColor, hoverTextColor)}
            >
              <span className="sr-only">Menurutmu Home</span>
              <h1 className="text-4xl font-display lowercase leading-none">
                menurutmu
              </h1>
            </Link>
          </div>

          {/* Tombol Hamburger Menu (Mobile Only) */}
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button
              className={clsx(
                "relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset",
                isHomePage && !isSolid
                  ? "bg-transparent text-light-cream hover:bg-white/20 focus:ring-light-cream" // Saat transparan
                  : "bg-transparent text-light-cream hover:bg-white/20 focus:ring-light-cream" // Selalu putih/transparan saat gelap
              )}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          {/* Navigasi Desktop */}
          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "text-base font-body transition-colors",
                  textColor,
                  hoverTextColor
                )}
              >
                {item.name}
              </Link>
            ))}
          </Popover.Group>

          {/* Tombol CTA Order (Desktop) */}
          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <Link
              href="/checkout"
              className={clsx(
                "whitespace-nowrap rounded-full px-6 py-2 text-base font-body transition-colors",
                buttonBgColor,
                buttonTextColor,
                buttonHoverBgColor
              )}
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Panel Menu Mobile (Full Screen Overlay) */}
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          {(
            { close } // Akses fungsi close dari Popover.Panel
          ) => (
            <div className="divide-y-2 divide-warm-brown rounded-lg bg-deep-mocha shadow-lg ring-1 ring-black ring-opacity-5">
              {" "}
              {/* Ubah bg jadi deep-mocha */}
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  {/* Logo di Panel Mobile */}
                  <div>
                    <h1 className="text-3xl font-display lowercase leading-none text-light-cream">
                      menurutmu
                    </h1>
                  </div>
                  {/* Tombol Tutup Menu Mobile */}
                  <div className="-mr-2">
                    <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-deep-mocha p-2 text-light-cream hover:bg-warm-brown focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-cream">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                {/* Navigasi di Panel Mobile */}
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => close()} // PENTING: Tambahkan onClick={() => close()} untuk auto close
                        className="-m-3 flex items-center rounded-md p-3 text-light-cream hover:bg-warm-brown font-body text-xl"
                      >
                        <span className="ml-3 text-base font-medium">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              {/* CTA Order di Panel Mobile (opsional) */}
              <div className="space-y-6 px-5 py-6">
                <div>
                  <Link
                    href="/checkout"
                    onClick={() => close()} // PENTING: Tambahkan onClick={() => close()}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-clay-pink px-4 py-2 text-base font-medium text-deep-mocha shadow-sm hover:bg-warm-brown hover:text-light-cream"
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
