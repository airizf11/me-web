// src/components/admin/AdminBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ListBulletIcon,
  ShoppingCartIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const bottomNavItems = [
  { name: "Dashboard", href: "/mudir", icon: HomeIcon },
  { name: "Menu", href: "/mudir/menus", icon: ListBulletIcon },
  { name: "Penjualan", href: "/mudir/transactions", icon: ShoppingCartIcon },
  { name: "Lainnya", href: "/mudir/more", icon: EllipsisVerticalIcon },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full md:hidden bg-deep-mocha text-light-cream shadow-lg z-20 border-t border-warm-brown">
      <div className="flex justify-around items-center h-16">
        {bottomNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/mudir/more" &&
              pathname.startsWith("/mudir/") &&
              !["/mudir", "/mudir/menus", "/mudir/transactions"].includes(
                pathname
              ));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 flex-1 
                          ${
                            isActive
                              ? "text-clay-pink"
                              : "text-light-cream hover:text-warm-brown"
                          } 
                          transition-colors duration-200`}
            >
              <item.icon className="h-6 w-6 mb-1" aria-hidden="true" />
              <span className="text-xs font-body">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
