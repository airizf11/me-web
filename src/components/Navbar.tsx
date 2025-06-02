// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  // Tambah lain di masa depan misal: 'Tentang', 'Kontak'
];

export function Navbar() {
  return (
    <Popover className="relative bg-deep-mocha text-light-cream shadow-md sticky top-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link
              href="/"
              className="text-light-cream hover:text-warm-brown transition-colors"
            >
              <span className="sr-only">Menurutmu Home</span>
              <h1 className="text-3xl font-display lowercase leading-none text-light-cream">
                menurutmu
              </h1>
            </Link>
          </div>

          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-deep-mocha p-2 text-light-cream hover:bg-warm-brown hover:text-light-cream focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-cream">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-body text-light-cream hover:text-warm-brown transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </Popover.Group>

          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <Link
              href="/menu"
              className="whitespace-nowrap rounded-full bg-light-cream border border-deep-mocha px-6 py-2 text-base font-body text-deep-mocha hover:bg-warm-brown hover:text-light-cream hover:border-warm-brown transition-colors"
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
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          {({ close }) => (
            <div className="divide-y-2 divide-deep-mocha rounded-lg bg-deep-mocha shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-display lowercase leading-none text-deep-mocha">
                      menurutmu
                    </h1>
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-light-cream p-2 text-deep-mocha hover:bg-clay-pink hover:text-deep-mocha focus:outline-none focus:ring-2 focus:ring-inset focus:ring-deep-mocha">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
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
                    href="/menu"
                    onClick={() => close()}
                    className="flex w-full items-center justify-center rounded-md border border-deep-mocha bg-light-cream px-4 py-2 text-base font-medium text-deep-mocha shadow-sm hover:bg-warm-brown hover:text-light-cream hover:border-warm-brown"
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
