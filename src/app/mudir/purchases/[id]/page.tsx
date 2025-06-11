/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/purchases/[id]/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClientReadOnly } from "@/lib/supabase/server";
import { type Transaction, type PurchaseItem } from "@/lib/types";
import { getTransactionDetails } from "@/lib/actions/transactions/read";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PurchaseDetailsPageProps {
  params?: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PurchaseDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: "Detail Pembelian - Mudir Menurutmu",
      description: "Detail catatan transaksi pembelian.",
    };
  }

  const { data: transaction } = await getTransactionDetails(id);

  return {
    title: transaction
      ? `Detail Pembelian: ${transaction.id.substring(0, 8)}...`
      : "Detail Pembelian - Mudir Menurutmu",
    description: "Detail catatan transaksi pembelian.",
  };
}

export default async function PurchaseDetailsPage({
  params,
}: PurchaseDetailsPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
    return null;
  }

  const { data: transaction, error } = await getTransactionDetails(id);

  if (error || !transaction || transaction.type !== "purchase") {
    console.error(
      "Error fetching purchase details or not a purchase transaction:",
      error
    );
    notFound();
    return null;
  }

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        Detail Pembelian
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          Ringkasan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-deep-mocha font-body">
          <div>
            <p>
              <strong>ID Pembelian:</strong> {transaction.id}
            </p>
            <p>
              <strong>Waktu:</strong>{" "}
              {formatTimestamp(transaction.transaction_timestamp)}
            </p>
            <p>
              <strong>Sumber:</strong> {transaction.platform_source}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {transaction.total_amount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>
          <div>
            {transaction.status && (
              <p>
                <strong>Status:</strong> {transaction.status}
              </p>
            )}
            {transaction.notes && (
              <p>
                <strong>Catatan:</strong> {transaction.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-display lowercase mb-4">Item Pembelian</h2>
        {transaction.purchase_items_json &&
        Array.isArray(transaction.purchase_items_json) &&
        transaction.purchase_items_json.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warm-brown text-deep-mocha">
              <thead className="bg-clay-pink text-deep-mocha">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Kuantitas
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Satuan
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Harga Satuan
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Subtotal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Kategori Kustom
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Deskripsi Kustom
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-pink/50">
                {transaction.purchase_items_json.map(
                  (item: PurchaseItem, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.raw_material_name}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.unit}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.unit_price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {(item.quantity * item.unit_price).toLocaleString(
                          "id-ID",
                          { style: "currency", currency: "IDR" }
                        )}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.custom_category || "-"}
                      </td>
                      <td className="px-4 py-3 font-body text-sm">
                        {item.custom_description || "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-warm-brown">
            Tidak ada item pembelian yang tercatat untuk transaksi ini.
          </p>
        )}
      </div>

      {transaction.screenshot_url && (
        <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-display lowercase mb-4">
            Bukti Pembelian
          </h2>
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-lg overflow-hidden border border-deep-mocha shadow-md">
            <Image
              src={transaction.screenshot_url}
              alt={`Bukti pembelian ${transaction.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Link
          href="/mudir/purchases"
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
        >
          Kembali ke Daftar Pembelian
        </Link>
      </div>
    </div>
  );
}
