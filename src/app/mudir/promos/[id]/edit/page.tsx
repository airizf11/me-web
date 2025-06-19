// src/app/mudir/promos/[id]/edit/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPromoById } from "@/lib/actions/promo";
import { PromoForm } from "@/components/admin/promo/PromoForm";

interface EditPromoPageProps {
  params?: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditPromoPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.id) return { title: "Edit Promo" };
  const { data: promo } = await getPromoById(resolvedParams.id);
  return { title: promo ? `Edit Promo "${promo.name}"` : "Edit Promo" };
}

export default async function EditPromoPage({ params }: EditPromoPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) return notFound();
  const { data: promo } = await getPromoById(resolvedParams.id);
  if (!promo) return notFound();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Edit Promo
      </h1>
      <div className="bg-light-cream p-6 rounded-lg shadow-md">
        <PromoForm initialData={promo} />
      </div>
    </div>
  );
}
