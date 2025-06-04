// src/app/mudir/layout.tsx
"use client";

import { useState, Suspense } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBottomNav } from "@/components/admin/AdminBottomNav";

export default function MudirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col min-h-screen md:pl-64">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-grow p-4 md:p-8 pb-20 md:pb-8 bg-light-cream">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full text-deep-mocha text-xl font-body">
                Memuat...
              </div>
            }
          >
            {children}
          </Suspense>
        </main>

        <AdminBottomNav />
      </div>
    </>
  );
}
