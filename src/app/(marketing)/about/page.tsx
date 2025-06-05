/* eslint-disable react/no-unescaped-entities */
// src/app/(marketing)/about/page.tsx
import { Link } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Menurutmu - Visi, Misi, Filosofi",
  description:
    "Kenali lebih dekat visi, misi, dan filosofi di balik brand minuman reflektif Menurutmu.",
};

export default function AboutPage() {
  return (
    <section className="container mx-auto p-8 py-20 bg-light-cream">
      <h1 className="text-4xl font-display lowercase text-deep-mocha mb-8 text-center">
        tentang menurutmu
      </h1>

      <div className="max-w-4xl mx-auto space-y-8 text-deep-mocha font-body leading-relaxed">
        <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-display lowercase mb-4">Visi</h2>
          <p>
            Menjadi brand minuman reflektif yang tidak sekadar menyegarkan, tapi
            juga mengajak konsumen berpikir dan berdialog — satu cup, satu
            makna. Kami percaya setiap tegukan adalah momen untuk merenung,
            menemukan inspirasi, dan terhubung dengan diri sendiri serta dunia
            di sekitar.
          </p>
        </div>

        <div className="bg-light-cream p-6 rounded-lg shadow-md border border-warm-brown">
          <h2 className="text-2xl font-display lowercase mb-4 text-deep-mocha">
            Misi
          </h2>
          <ul className="list-disc list-inside space-y-2 text-warm-brown">
            <li>
              Menyajikan kopi dan minuman lain yang enak, ringan, dan relatable
              untuk Gen Z & Milenial.
            </li>
            <li>
              Membangun koneksi emosional dan diskusi reflektif lewat desain,
              kutipan, dan konten.
            </li>
            <li>
              Menjadi teman berpikir di tengah rutinitas cepat — hangat, tenang,
              dan personal.
            </li>
          </ul>
        </div>

        <div className="bg-warm-brown text-light-cream p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-display lowercase mb-4">
            Filosofi Kami
          </h2>
          <p className="mb-4">
            Di "Menurutmu", kami bukan hanya tentang kafein. Kami tentang momen
            jeda, tentang pertanyaan yang memicu pikiran, tentang kenyamanan
            dalam kesendirian atau kehangatan dalam percakapan. Kami ingin
            menjadi bagian dari rutinitas Anda yang sibuk, menawarkan secangkir
            ketenangan yang juga merangsang kontemplasi.
          </p>
          <p>
            Karakter brand kami: Reflektif, lembut, akrab, kontemplatif, hangat,
            berpikir terbuka. Kami berkomunikasi dengan santai tapi peka, tidak
            menggurui, dan selalu lebih banyak bertanya daripada menyimpulkan.
          </p>
        </div>

        <div className="text-center pt-8">
          <p className="text-lg text-deep-mocha font-body mb-4">
            Ingin berbagi pemikiran atau pertanyaan menurutmu?
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-deep-mocha text-light-cream rounded-full hover:bg-warm-brown transition-colors duration-300 font-body text-lg"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  );
}
