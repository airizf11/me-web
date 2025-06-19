// src/components/marketing/CartDrawer.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WA_BUSINESS_NUMBER = "6283113156507";
const INSTAGRAM_USERNAME = "me_nurutmu";

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } =
    useCartStore();
  const [showCopyModal, setShowCopyModal] = useState(false);

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  const generateOrderSummary = () => {
    let summary = `Halo Menurutmu, saya ingin memesan:\n\n`;
    items.forEach((item) => {
      summary += `- ${item.name} (${item.quantity}x) = ${formatCurrency(
        item.price * item.quantity
      )}\n`;
    });
    summary += `\nTotal Pesanan: *${formatCurrency(getTotalPrice())}*`;
    summary += `\n\nTerima kasih!`;
    return summary;
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const message = encodeURIComponent(generateOrderSummary());
    window.open(
      `https://wa.me/${WA_BUSINESS_NUMBER}?text=${message}`,
      "_blank"
    );
  };

  const handleCopyOrder = () => {
    if (items.length === 0) return;
    const summary = generateOrderSummary();
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        toast.success("Pesanan berhasil disalin!");
      })
      .catch((err) => {
        toast.error("Gagal menyalin pesanan.");
        console.error("Copy to clipboard failed:", err);
      });
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-light-cream shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-xl font-display lowercase text-deep-mocha">
                            Keranjang Belanja
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-warm-brown hover:text-deep-mocha"
                              onClick={onClose}
                            >
                              <span className="sr-only">Tutup panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            {items.length > 0 ? (
                              <ul
                                role="list"
                                className="-my-6 divide-y divide-clay-pink"
                              >
                                {items.map((item) => (
                                  <li key={item.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-clay-pink">
                                      <Image
                                        src={
                                          item.image_url ||
                                          "/images/menu-placeholder.jpg"
                                        }
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-deep-mocha">
                                          <h3>
                                            <Link href={`/menu/${item.slug}`}>
                                              {item.name}
                                            </Link>
                                          </h3>
                                          <p className="ml-4">
                                            {formatCurrency(
                                              item.price * item.quantity
                                            )}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-warm-brown">
                                          {formatCurrency(item.price)} / pcs
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2 border border-clay-pink rounded-md">
                                          <button
                                            onClick={() =>
                                              updateQuantity(item.id, -1)
                                            }
                                            className="p-1 text-deep-mocha hover:bg-clay-pink rounded-l-md"
                                          >
                                            <MinusIcon className="h-4 w-4" />
                                          </button>
                                          <p className="text-gray-900">
                                            {item.quantity}
                                          </p>
                                          <button
                                            onClick={() =>
                                              updateQuantity(item.id, 1)
                                            }
                                            className="p-1 text-deep-mocha hover:bg-clay-pink rounded-r-md"
                                          >
                                            <PlusIcon className="h-4 w-4" />
                                          </button>
                                        </div>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="font-medium text-red-600 hover:text-red-500"
                                          >
                                            <TrashIcon className="h-5 w-5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-center text-warm-brown py-12">
                                <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4" />
                                <p className="font-body">
                                  Keranjang belanjamu masih kosong.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="border-t border-clay-pink px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-deep-mocha">
                            <p>Subtotal</p>
                            <p>{formatCurrency(getTotalPrice())}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-warm-brown">
                            Ongkos kirim akan dihitung oleh kurir.
                          </p>

                          <div className="mt-6 space-y-3">
                            <button
                              onClick={handleWhatsAppCheckout}
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                            >
                              Pesan via WhatsApp
                            </button>
                            <button
                              onClick={() => setShowCopyModal(true)}
                              className="flex w-full items-center justify-center rounded-md border border-deep-mocha px-6 py-3 text-base font-medium text-deep-mocha shadow-sm hover:bg-deep-mocha hover:text-light-cream"
                            >
                              Pesan via Platform Lain (IG, dll.)
                            </button>
                          </div>

                          <div className="mt-6 flex justify-center text-center text-sm text-warm-brown">
                            <p>
                              atau{" "}
                              <button
                                type="button"
                                className="font-medium text-deep-mocha hover:text-warm-brown"
                                onClick={onClose}
                              >
                                Lanjutkan Belanja
                                <span aria-hidden="true"> →</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-light-cream p-6 rounded-lg shadow-2xl w-full max-w-lg relative text-deep-mocha">
            <h3 className="text-2xl font-display lowercase mb-4">
              Salin & Kirim Pesananmu
            </h3>
            <p className="text-sm font-body text-warm-brown mb-4">
              Silakan salin ringkasan pesanan di bawah ini dan kirimkan melalui
              Direct Message (DM) ke Instagram kita.
            </p>
            <textarea
              readOnly
              value={generateOrderSummary()}
              className="w-full h-40 p-3 border border-warm-brown rounded-md bg-white font-mono text-sm"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyOrder}
                className="flex-1 bg-deep-mocha text-light-cream px-6 py-3 rounded-md font-body hover:bg-warm-brown transition-colors"
              >
                Salin Pesanan
              </button>
              <a
                href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-clay-pink text-deep-mocha px-6 py-3 rounded-md font-body hover:bg-warm-brown hover:text-light-cream transition-colors"
              >
                Buka Instagram
              </a>
            </div>
            <button
              onClick={() => setShowCopyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-warm-brown text-light-cream hover:bg-clay-pink hover:text-deep-mocha"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
