// src/components/admin/AdminHeader.tsx
"use client";

import Link from "next/link";
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type AdminHeaderProps = {
  onOpenSidebar: () => void;
};

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Logout Gagal: ${error.message}`);
      console.error("Logout Error:", error.message);
    } else {
      toast.success("Anda telah logout.");
      router.push("/mudir/login");
    }
  };

  return (
    <header className="bg-deep-mocha text-light-cream p-4 shadow-md sticky top-0 z-20">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="md:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-md hover:bg-warm-brown transition-colors"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <Link
          href="/mudir"
          className="text-2xl font-display lowercase hover:text-warm-brown transition-colors leading-none flex-grow text-center md:text-left md:flex-grow-0"
        >
          menurutmu mudir
        </Link>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full hover:bg-warm-brown transition-colors"
            aria-label="User menu"
          >
            <UserCircleIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-warm-brown transition-colors"
            aria-label="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
