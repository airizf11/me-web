// src/app/mudir/promos/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
// import { type Promo } from '@/lib/types';
import { PromoTable } from "@/components/admin/promo/PromoTable";

export const metadata: Metadata = {
  title: "Manajemen Promo - Mudir Menurutmu",
};

export default async function PromosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: promos } = await supabase
    .from("promos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display lowercase text-deep-mocha">
          Manajemen Promo
        </h1>
        <Link
          href="/mudir/promos/create"
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body"
        >
          Tambah Promo
        </Link>
      </div>
      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <PromoTable promos={promos || []} />
      </div>
    </div>
  );
}
