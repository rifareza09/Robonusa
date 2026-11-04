import React from 'react';
import { Head } from '@inertiajs/react';

/**
 * RoboKreasi — Halaman Beranda (Home)
 * Desain sejalan dengan tema hijau RoboNusa (#37BD71).
 */
export default function Home() {
  return (
    <>
      <Head title="Beranda - RoboKreasi" />

      <div className="min-h-screen bg-[#FBFDFD] text-gray-900 font-sans flex flex-col selection:bg-[#E8F8F0] selection:text-[#1E7341]">
        {/* ─── Navbar Utama (Identik dengan Contoh Proyek) ───────────────────── */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
            {/* Logo & Nav Tabs */}
            <div className="flex items-center gap-8">
              <a href="/beranda" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-[#37BD71] flex items-center justify-center text-white text-base shadow-sm group-hover:bg-[#2CA360] transition-colors">
                  🤖
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#1E7341] font-sans">
                  RoboNusa!
                </span>
              </a>

              {/* Menu Navigasi Utama */}
              <div className="flex items-center gap-6 text-sm">
                <span className="text-[#1E7341] font-bold border-b-2 border-[#37BD71] pb-1 cursor-default">
                  Beranda
                </span>
                <a
                  href="/contoh-proyek"
                  className="text-gray-600 hover:text-[#37BD71] font-medium transition-colors"
                >
                  Contoh Proyek
                </a>
              </div>
            </div>

            {/* Aksi Kanan Navbar */}
            <div className="flex items-center gap-3">
              <a
                href="/contoh-proyek"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#1E7341] transition-colors"
              >
                <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[11px] font-bold">
                  ?
                </span>
                <span>Bantuan</span>
              </a>
              <a
                href="/robokreasi"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#37BD71] hover:bg-[#2CA360] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer shadow-[#37BD71]/20"
              >
                <span className="text-sm font-bold leading-none">+</span>
                <span>Proyek baru</span>
              </a>
            </div>
          </div>
        </nav>

        {/* ─── Hero Section Sesuai Skema Contoh Proyek ───────────────────────── */}
        <section className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Teks Hero */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-block px-3 py-1 bg-[#E8F8F0] text-[#1E7341] font-bold text-xs tracking-wider uppercase rounded-md mb-5 border border-[#37BD71]/30">
                RACERO SCRATCH • ROBOKREASI
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12] mb-6">
                Berkreasi dengan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37BD71] to-[#1E7341]">
                  Racero Scratch
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
                Susun blok kode visual untuk membuat algoritma robot virtual, uji sensor garis dan rintangan, serta wujudkan imajinasi robotikamu secara interaktif.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/robokreasi"
                  className="px-7 py-3.5 bg-[#37BD71] hover:bg-[#2CA360] active:bg-[#1E7341] text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-[#37BD71]/25 hover:shadow-xl hover:shadow-[#37BD71]/35 hover:-translate-y-0.5 cursor-pointer"
                >
                  Mulai Membuat →
                </a>

                <a
                  href="/contoh-proyek"
                  className="px-6 py-3.5 bg-white hover:bg-[#E8F8F0] text-[#1E7341] font-bold text-base rounded-2xl border-2 border-[#37BD71]/30 hover:border-[#37BD71] transition-colors shadow-2xs"
                >
                  Lihat Contoh Proyek 💡
                </a>
              </div>
            </div>

            {/* Ilustrasi Puzzle Blok Sesuai Tema RoboNusa #37BD71 ─────────────── */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md p-6 bg-[#F2FBF6] rounded-3xl border border-[#37BD71]/20 shadow-xl shadow-[#37BD71]/5">
                {/* Blok Utama Hijau RoboNusa & Karakter Robot */}
                <div className="flex items-center justify-center gap-5 py-4">
                  <img
                    src="/images/robot_sprite.png"
                    alt="RoboNusa Robot"
                    className="w-16 h-auto drop-shadow-md hover:scale-105 transition-transform"
                  />
                  <div className="flex items-stretch shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-105 duration-200">
                    {/* Blok Gerak Hijau */}
                    <div className="bg-[#37BD71] text-white px-5 py-4 font-extrabold text-base flex items-center gap-2 border-r border-[#2CA360] select-none">
                      <span>🧩</span>
                      <span>Maju 10 cm</span>
                    </div>
                    {/* Sambungan Blok Kuning */}
                    <div className="bg-[#F59E0B] text-white px-4 py-4 font-extrabold text-base flex items-center justify-center select-none">
                      <span>✓</span>
                    </div>
                  </div>
                </div>

                {/* Sub-blok dekorasi telemetri */}
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#37BD71]/20 shadow-2xs flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#37BD71] animate-ping" />
                      <span>Simulator Robot Virtual Siap</span>
                    </span>
                    <span className="text-[#1E7341] font-bold">Kanvas Original</span>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#37BD71]/20 shadow-2xs flex items-center gap-2.5 text-xs text-gray-600">
                    <span className="text-base">🎯</span>
                    <span>Sensor rintangan & sensor pendeteksi garis terintegrasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Fitur Tiga Kolom Sesuai Gaya Kartu Contoh Proyek ────────────── */}
          <div className="mt-20 pt-16 border-t border-gray-200/80 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1: Didesain Aksesibel */}
            <div className="p-7 rounded-3xl bg-white border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow shadow-2xs">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Didesain Aksesibel
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Dirancang agar siapa saja bisa berinteraksi dengan kode visual — membantu siswa menciptakan algoritma robot secara intuitif dan inklusif.
                </p>
              </div>

              {/* Ilustrasi Aksesibel */}
              <div className="h-32 rounded-2xl bg-[#E8F8F0]/50 border border-[#37BD71]/20 flex items-center justify-center p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
                    👁️
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#37BD71] text-white flex items-center justify-center text-2xl shadow-xs">
                    🧍
                  </div>
                </div>
              </div>
            </div>

            {/* Fitur 2: Dirancang Fleksibel */}
            <div className="p-7 rounded-3xl bg-white border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow shadow-2xs">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Dirancang Fleksibel
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Blok logika visual kompatibel dengan Blockly dan simulator robot virtual. Mudah dijalankan langsung di peramban tanpa instalasi driver tambahan.
                </p>
              </div>

              {/* Ilustrasi Fleksibel */}
              <div className="h-32 rounded-2xl bg-[#E8F8F0]/50 border border-[#37BD71]/20 flex items-center justify-center p-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-[#E8F8F0] text-[#1E7341] font-mono text-xs font-bold rounded-lg border border-[#37BD71]/30">
                    &lt;code&gt;
                  </div>
                  <span className="text-gray-300">⇄</span>
                  <div className="px-3 py-2 bg-[#37BD71] text-white text-xs font-bold rounded-lg shadow-xs">
                    🧩 Visual
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Maskot Robot Hijau Sesuai Gaya Contoh Proyek */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#37BD71] to-[#1E7341] text-white flex flex-col justify-between shadow-xl shadow-[#37BD71]/20">
              <div>
                {/* Bubble Pesan Maskot */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/15 rounded-xl text-xs font-bold mb-4 backdrop-blur-xs border border-white/20">
                  <span>Pesan:</span>
                  <span>Hi, Aku RoboNusa! 🤖</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">
                  Siap Belajar Logika Pemrograman?
                </h3>
                <p className="text-sm text-emerald-100 leading-relaxed mb-6">
                  Pelajari logika komputer melalui gerak robot virtual, sensor jarak, dan rintangan arena.
                </p>
              </div>

              <a
                href="/robokreasi"
                className="w-full py-3 bg-white hover:bg-[#E8F8F0] text-[#1E7341] font-extrabold text-sm rounded-xl text-center transition-colors shadow-md cursor-pointer"
              >
                Buka Workspace RoboKreasi 🚀
              </a>
            </div>
          </div>
        </section>

        {/* ─── Footer Bawah Sesuai Tema Contoh Proyek ───────────────────────── */}
        <footer className="border-t border-gray-200 bg-white py-6 px-6 text-xs text-gray-500">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1E7341]">RoboNusa!</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} Racer Robotic. Berkreasi dengan Racero Scratch.</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <a href="/contoh-proyek" className="text-[#37BD71] hover:underline">
                Contoh Proyek
              </a>
              <span className="text-gray-300">•</span>
              <a href="/robokreasi" className="text-[#37BD71] hover:underline">
                Ruang Pemrograman
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
