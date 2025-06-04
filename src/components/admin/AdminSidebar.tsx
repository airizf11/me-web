// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cog6ToothIcon,
  HomeIcon,
  ListBulletIcon,
  PhotoIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const adminNavItems = [
  { name: "Dashboard", href: "/mudir", icon: HomeIcon },
  { name: "Manajemen Menu", href: "/mudir/menus", icon: ListBulletIcon },
  { name: "Manajemen Carousel", href: "/mudir/carousel", icon: PhotoIcon },
  // Tambah link lain
  {
    name: "Catatan Transaksi",
    href: "/mudir/transactions",
    icon: ShoppingCartIcon,
  },
  { name: "Pengaturan", href: "/mudir/settings", icon: Cog6ToothIcon },
];

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-deep-mocha bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-light-cream"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-warm-brown px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link
                      href="/mudir"
                      className="text-3xl font-display lowercase leading-none text-light-cream"
                    >
                      menurutmu Admin
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                      {adminNavItems.map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (pathname.startsWith(item.href) &&
                            item.href !== "/mudir");
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`
                                group flex gap-x-3 rounded-md p-2 text-sm font-body leading-6 
                                ${
                                  isActive
                                    ? "bg-clay-pink text-deep-mocha"
                                    : "text-light-cream hover:bg-clay-pink hover:text-deep-mocha"
                                }
                              `}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-30 md:w-64 bg-warm-brown text-light-cream shadow-lg">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/mudir"
              className="text-3xl font-display lowercase leading-none text-light-cream"
            >
              menurutmu Admin
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-4">
              {adminNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (pathname.startsWith(item.href) && item.href !== "/mudir");
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-body leading-6 
                        ${
                          isActive
                            ? "bg-clay-pink text-deep-mocha"
                            : "text-light-cream hover:bg-clay-pink hover:text-deep-mocha"
                        }
                      `}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
