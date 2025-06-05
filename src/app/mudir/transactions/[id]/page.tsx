/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/transactions/[id]/page.tsx
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Transaction, type TransactionItem } from "@/lib/types";
import { getTransactionDetails } from "@/lib/actions/transactions/read"; // Server Action
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "lucide-react";

interface TransactionDetailsPageProps {
  params?: Promise<{
    id: string; // ID transaksi dari URL
  }>;
}

export async function generateMetadata({
  params,
}: TransactionDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: "Detail Transaksi - Mudir Menurutmu",
      description: "Detail catatan transaksi penjualan.",
    };
  }

  const { data: transaction } = await getTransactionDetails(id);

  return {
    title: transaction
      ? `Detail Transaksi: ${transaction.id.substring(0, 8)}...`
      : "Detail Transaksi - Mudir Menurutmu",
    description: "Detail catatan transaksi penjualan.",
  };
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
    return null;
  }

  const { data: transaction, error } = await getTransactionDetails(id);

  if (error || !transaction) {
    console.error("Error fetching transaction details:", error);
    notFound(); // Tampilkan 404 jika tidak ditemukan atau ada error fetch
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
        detail transaksi
      </h1>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          ringkasan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-deep-mocha font-body">
          <div>
            <p>
              <strong>ID Transaksi:</strong> {transaction.id}
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
            {transaction.customer_name && (
              <p>
                <strong>Pelanggan:</strong> {transaction.customer_name}
              </p>
            )}
            {transaction.customer_phone && (
              <p>
                <strong>Telepon:</strong> {transaction.customer_phone}
              </p>
            )}
            {transaction.customer_ig_username && (
              <p>
                <strong>IG:</strong> @{transaction.customer_ig_username}
              </p>
            )}
            {transaction.customer_food_delivery_id && (
              <p>
                <strong>ID Pesanan:</strong>{" "}
                {transaction.customer_food_delivery_id}
              </p>
            )}
          </div>
        </div>

        {transaction.notes && (
          <div className="mt-4 border-t border-warm-brown pt-4">
            <p>
              <strong>Catatan:</strong> {transaction.notes}
            </p>
          </div>
        )}
      </div>

      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
          item transaksi
        </h2>
        {transaction.items && transaction.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warm-brown text-deep-mocha">
              <thead className="bg-clay-pink text-deep-mocha">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Menu
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Jumlah
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Harga Satuan
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-body uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-pink/50">
                {transaction.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 flex items-center">
                      {item.menu_item?.image_url && (
                        <div className="w-10 h-10 relative rounded-sm overflow-hidden mr-2">
                          <Image
                            src={item.menu_item.image_url}
                            alt={item.menu_item.name || "Menu Item"}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <span className="font-body text-sm">
                        {item.menu_item?.name || "Unknown Item"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-body">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm font-body">
                      {item.price_at_transaction.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-body">
                      {(
                        item.quantity * item.price_at_transaction
                      ).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-warm-brown">
            Tidak ada item yang tercatat untuk transaksi ini.
          </p>
        )}
      </div>

      {transaction.screenshot_url && (
        <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-display lowercase text-deep-mocha mb-4">
            screenshot transaksi
          </h2>
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-lg overflow-hidden border border-deep-mocha shadow-md">
            <Image
              src={transaction.screenshot_url}
              alt={`Screenshot transaksi ${transaction.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }} // Gunakan 'contain' agar gambar tidak terpotong
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Link
          href="/mudir/transactions"
          className="px-5 py-2 border border-warm-brown text-warm-brown rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors duration-200"
        >
          Kembali ke Daftar Transaksi
        </Link>
      </div>
    </div>
  );
}
