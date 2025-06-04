// src/app/layout.tsx
import type { Metadata } from "next";
import { Work_Sans, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "menurutmu - Bagaimana hari ini?",
  description: "Brand minuman reflektif yang mengajak berpikir dan berdialog.",
  // Tambah meta tag SEO lain nanti, seperti og:image, og:url, dll.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${workSans.variable} ${josefinSans.variable} font-body bg-light-cream text-deep-mocha antialiased`}
      >
        {children}
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
