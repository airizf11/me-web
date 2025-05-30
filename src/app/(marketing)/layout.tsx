// src/app/(marketing)/layout.tsx
import { Navbar } from "@/components/Navbar"; // Belum dibuat, akan dibuat nanti
import { Footer } from "@/components/Footer"; // Belum dibuat, akan dibuat nanti

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
