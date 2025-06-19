// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { Fragment, useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Kontak", href: "/contact" },
  { name: "Tentang Kami", href: "/about" },
];

export function Navbar({
  onCartClick,
  cartItemCount,
}: {
  onCartClick: () => void;
  cartItemCount: number;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const pathname = usePathname();
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const prevCartItemCount = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCartItemCount.current) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    prevCartItemCount.current = cartItemCount;
  }, [cartItemCount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHeroHeight(window.innerHeight);
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const isHeroPage = pathname === "/";
  // || pathname.startsWith("/menu/");
  const scrollThreshold = isHeroPage ? heroHeight * 0.7 : 20;
  const opacity =
    scrollY > scrollThreshold
      ? 1
      : isHeroPage
      ? Math.min(1, scrollY / scrollThreshold)
      : 1;
  const navbarBg = `rgba(109, 76, 65, ${opacity})`;
  const isSolid = opacity >= 0.9;

  const textColor =
    isHeroPage && !isSolid ? "text-light-cream" : "text-light-cream";
  const hoverTextColor = "hover:text-clay-pink";
  const buttonTextColor = "text-deep-mocha";
  const buttonBgColor = "bg-clay-pink";
  const buttonHoverBgColor = "hover:bg-warm-brown hover:text-light-cream";

  return (
    <Popover
      as={motion.header}
      initial={false}
      animate={{
        boxShadow:
          scrollY > scrollThreshold
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
            : "none",
      }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{ backgroundColor: navbarBg }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:justify-start md:space-x-10">
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

          <div className="-my-2 -mr-2 md:hidden">
            <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-light-cream hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-cream">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </PopoverButton>
          </div>

          <PopoverGroup as="nav" className="hidden space-x-10 md:flex">
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
          </PopoverGroup>

          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <motion.button
              onClick={onCartClick}
              className={clsx(
                "hidden md:flex items-center justify-center rounded-full relative transition-all duration-300",
                cartItemCount > 0 ? "bg-white/10 pr-4" : "pr-2",
                "pl-4 py-2"
              )}
              aria-label={`Buka keranjang, ${cartItemCount} item`}
              animate={
                isCartAnimating
                  ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
                  : {}
              }
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ShoppingCartIcon className={clsx("h-6 w-6", textColor)} />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      marginLeft: "0.5rem",
                    }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    className="flex items-center overflow-hidden"
                  >
                    <span className={clsx("text-sm font-body", textColor)}>
                      {cartItemCount} item
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <Link
              href="/checkout"
              className={clsx(
                "ml-4 whitespace-nowrap rounded-full px-6 py-2 text-base font-body transition-colors",
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

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          {({ close }) => (
            <div className="divide-y-2 divide-warm-brown/50 rounded-lg bg-deep-mocha shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-display lowercase leading-none text-light-cream">
                      menurutmu
                    </h1>
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-deep-mocha p-2 text-light-cream hover:bg-warm-brown focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-cream">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </PopoverButton>
                  </div>
                </div>
                <div className="mt-8">
                  <nav className="grid gap-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => close()}
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
              <div className="space-y-6 px-5 py-6">
                <div>
                  <Link
                    href="/checkout"
                    onClick={() => close()}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-clay-pink px-4 py-2 text-base font-medium text-deep-mocha shadow-sm hover:bg-warm-brown hover:text-light-cream"
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
