// src/components/marketing/CartDrawer.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId);
    toast.error(`${itemName} dihapus dari keranjang.`);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-deep-mocha/30 backdrop-blur-sm transition-opacity" />
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
                            className="-m-2 p-2 text-warm-brown hover:text-deep-mocha focus:outline-none focus:ring-2 focus:ring-deep-mocha"
                            onClick={onClose}
                          >
                            <span className="sr-only">Tutup panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {items.length > 0 ? (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-clay-pink/50"
                            >
                              {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-clay-pink/50">
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
                                          <Link
                                            href={`/menu/${item.slug}`}
                                            onClick={onClose}
                                          >
                                            {item.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4 whitespace-nowrap">
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
                                      <div className="flex items-center space-x-2 border border-clay-pink rounded-full p-1">
                                        <button
                                          onClick={() =>
                                            updateQuantity(item.id, -1)
                                          }
                                          className="p-1 text-deep-mocha hover:bg-clay-pink/50 rounded-full"
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <p className="text-gray-900 w-6 text-center font-semibold">
                                          {item.quantity}
                                        </p>
                                        <button
                                          onClick={() =>
                                            updateQuantity(item.id, 1)
                                          }
                                          className="p-1 text-deep-mocha hover:bg-clay-pink/50 rounded-full"
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveItem(item.id, item.name)
                                          }
                                          className="font-medium text-red-500 hover:text-red-400 p-1"
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
                            <div className="text-center text-warm-brown py-16">
                              <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="font-body text-lg">
                                Keranjang belanjamu kosong.
                              </p>
                              <p className="text-sm mt-2">
                                Mari isi dengan sesuatu yang reflektif.
                              </p>
                              <button
                                onClick={onClose}
                                className="mt-6 inline-flex items-center bg-deep-mocha text-light-cream px-6 py-2 rounded-full font-body hover:bg-warm-brown transition-colors"
                              >
                                Jelajahi Menu
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-clay-pink/50 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-deep-mocha">
                          <p>Subtotal</p>
                          <p>{formatCurrency(getTotalPrice())}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-warm-brown">
                          Pajak dan ongkos kirim akan dihitung saat checkout.
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-deep-mocha px-6 py-3 text-base font-medium text-light-cream shadow-sm hover:bg-warm-brown transition-colors"
                          >
                            Lanjutkan ke Pembayaran
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                          </Link>
                        </div>
                        <div className="mt-4 flex justify-between text-center text-sm text-warm-brown">
                          <button
                            type="button"
                            className="font-medium text-deep-mocha hover:text-warm-brown"
                            onClick={onClose}
                          >
                            Lanjutkan Belanja
                          </button>
                          <button
                            type="button"
                            className="font-medium text-red-500 hover:text-red-400"
                            onClick={() => {
                              clearCart();
                              toast.success("Keranjang berhasil dikosongkan.");
                            }}
                          >
                            Kosongkan Keranjang
                          </button>
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
  );
}
