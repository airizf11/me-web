/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/mudir/users/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  UserGroupIcon,
  PlusCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Manajemen Pengguna - Mudir Menurutmu",
  description: "Kelola akun pengguna dan hak akses panel admin Menurutmu.",
};

export default function UsersManagementPage() {
  const dummyUsers = [
    {
      id: 1,
      name: "John Doe (Owner)",
      email: "john.doe@menurutmu.com",
      role: "owner",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Jane Smith (Admin)",
      email: "jane.smith@menurutmu.com",
      role: "admin",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Peter Jones (Kasir)",
      email: "peter.jones@menurutmu.com",
      role: "cashier",
      status: "Tidak Aktif",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-display lowercase text-deep-mocha mb-6">
        manajemen pengguna
      </h1>

      {/* Ringkasan Pengguna */}
      <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase mb-4">
          ringkasan pengguna
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-body">Total Pengguna Terdaftar:</span>
          <span className="text-3xl font-bold font-body">
            {dummyUsers.length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-body">Peran 'Owner':</span>
          <span className="text-3xl font-bold font-body">
            {dummyUsers.filter((u) => u.role === "owner").length}
          </span>
        </div>
      </div>

      {/* Tombol Tambah Pengguna Baru */}
      <div className="flex justify-end mb-6">
        <Link
          href="/mudir/users/create" // Placeholder link
          className="px-6 py-2 bg-deep-mocha text-light-cream rounded-md font-body hover:bg-warm-brown transition-colors flex items-center"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Tambah Pengguna Baru
        </Link>
      </div>

      {/* Bagian Daftar Pengguna */}
      <div className="bg-light-cream p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-display lowercase text-deep-mocha mb-4">
          Daftar Pengguna
        </h2>

        {dummyUsers.length === 0 ? (
          <div className="text-center p-8 text-warm-brown font-body">
            Belum ada pengguna yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-warm-brown">
            <table className="min-w-full divide-y divide-warm-brown">
              <thead className="bg-warm-brown text-light-cream">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Peran
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-body uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light-cream divide-y divide-clay-pink text-deep-mocha">
                {dummyUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-clay-pink/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium font-body">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-body">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-body capitalize">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <Link
                          href={`/mudir/users/${user.id}/edit`}
                          className="p-2 rounded-full text-deep-mocha hover:bg-clay-pink transition-colors"
                        >
                          Edit
                        </Link>
                        <button className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors">
                          Nonaktifkan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center pt-8 text-warm-brown font-body">
        <LockClosedIcon className="h-6 w-6 mr-2" />
        <span>Fitur manajemen pengguna sedang dalam pengembangan.</span>
      </div>
    </div>
  );
}
