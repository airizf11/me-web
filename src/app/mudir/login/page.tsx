// src/app/mudir/login/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

// export const metadata: Metadata = { // Metadata ini akan dihandle oleh parent layout
//   title: "Login Mudir - Menurutmu Admin",
//   description: "Halaman login untuk panel administrasi Menurutmu.",
// };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook yang menyebabkan masalah ini
  const supabase = createClient();

  // Ambil URL tujuan setelah login berhasil
  const redirectedFrom = searchParams.get("redirectedFrom") || "/mudir";
  const message = searchParams.get("message"); // Untuk pesan error dari middleware

  useEffect(() => {
    if (message) {
      toast.error(message);
    }
  }, [message]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(`Login Gagal: ${error.message}`);
      console.error("Login Error:", error.message);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userRole = user?.app_metadata.role;
      const allowedRoles = ["owner", "admin"];

      if (user && allowedRoles.includes(userRole as string)) {
        toast.success("Login Berhasil! Selamat datang.");
        router.push(redirectedFrom);
      } else {
        await supabase.auth.signOut();
        toast.error("Akses ditolak. Peran tidak valid.");
        console.warn("Login successful but unauthorized role:", userRole);
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-light-cream">
      <div className="bg-warm-brown text-light-cream p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-display lowercase text-center mb-6">
          login mudir
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-body mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-clay-pink text-deep-mocha border border-clay-pink
                         focus:ring-2 focus:ring-deep-mocha focus:outline-none placeholder-deep-mocha"
              placeholder="admin@menurutmu.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-body mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-clay-pink text-deep-mocha border border-clay-pink
                         focus:ring-2 focus:ring-deep-mocha focus:outline-none placeholder-deep-mocha"
              placeholder="******"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-mocha text-light-cream p-3 rounded-md font-body text-lg
                       hover:bg-clay-pink hover:text-deep-mocha transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
