// src/components/admin/AdminHeader.tsx
"use client";

import Link from "next/link";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";

type AdminHeaderProps = {
  onOpenSidebar?: () => void;
};

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  return (
    <header className="bg-deep-mocha text-light-cream p-4 shadow-md sticky top-0 z-20">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Tombol Hamburger Menu (Mobile Only) */}
        <div className="md:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-md hover:bg-warm-brown transition-colors"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo/Nama Brand Admin (Pusatkan di mobile, geser ke kanan di desktop) */}
        <Link
          href="/mudir"
          className="text-2xl font-display lowercase hover:text-warm-brown transition-colors leading-none flex-grow text-center md:text-left md:flex-grow-0"
        >
          menurutmu mudir
        </Link>

        {/* User Menu / Logout (Desktop & Mobile) */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full hover:bg-warm-brown transition-colors"
            aria-label="User menu"
          >
            <UserCircleIcon className="h-6 w-6" />
          </button>
          {/* Tombol logout nanti di sini */}
        </div>
      </div>
    </header>
  );
}
