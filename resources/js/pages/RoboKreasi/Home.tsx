/**
 * RoboKreasi — Halaman Depan Racero Scratch
 * Mengacu pada desain Figma: "Halaman depan Racero Scratch.png" & "Kit desain • RoboNusa.png"
 */

import React from 'react';
import { Head } from '@inertiajs/react';

export const Home: React.FC = () => {
  return (
    <>
      <Head title="RoboKreasi — Berkreasi dengan Racero Scratch" />

      <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
        {/* ─── Navbar ───────────────────────────────────────────────────────── */}
        <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
                🤖
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-blue-600">
                  RoboNusa!
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase -mt-1">
                  Racero Scratch
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/robokreasi"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Mulai Membuat</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </header>

        {/* ─── Hero Section Sesuai Figma ────────────────────────────────────── */}
        <section className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Teks Hero */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs tracking-wider uppercase rounded-md mb-5 border border-gray-200">
                RACERO SCRATCH
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12] mb-6">
                Berkreasi dengan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Racero Scratch
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
                Susun blok kode untuk membuat animasi, permainan, dan proyek robotik.
                Wujudkan ide kreatifmu dengan cara yang mudah dan menyenangkan.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/robokreasi"
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  Mulai Membuat
                </a>

                <a
                  href="/robokreasi"
                  className="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-base rounded-2xl border border-gray-200 transition-colors shadow-2xs"
                >
                  Lihat Contoh Proyek 💡
                </a>
              </div>
            </div>

            {/* Ilustrasi Puzzle Blok Sesuai Figma */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-500/5">
                {/* Blok Utama Biru & Kuning Sesuai Figma "Halaman depan Racero Scratch.png" */}
                <div className="flex items-center justify-center py-6">
                  <div className="flex items-stretch shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-105 duration-200">
                    {/* Blok Biru */}
                    <div className="bg-[#2563EB] text-white px-7 py-6 font-extrabold text-lg flex items-center gap-2 border-r border-blue-700/40 select-none">
                      <span>🧩</span>
                      <span>Maju 10 cm</span>
                    </div>
                    {/* Sambungan Blok Kuning */}
                    <div className="bg-[#F59E0B] text-white px-6 py-6 font-extrabold text-lg flex items-center justify-center select-none">
                      <span>✓</span>
                    </div>
                  </div>
                </div>

                {/* Sub-blok dekorasi floating */}
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-blue-100 shadow-xs flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Simulator Robot Virtual Siap</span>
                    </span>
                    <span className="text-blue-600 font-bold">120 × 90 cm</span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-purple-100 shadow-xs flex items-center gap-2.5 text-xs text-gray-600">
                    <span className="text-base">🎯</span>
                    <span>Sensor rintangan & sensor pendeteksi garis terintegrasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Fitur Dua Kolom Sesuai Figma ───────────────────────────────── */}
          <div className="mt-20 pt-16 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1: Didesain Aksesibel */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Didesain Aksesibel
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Dirancang agar siapa saja bisa berinteraksi dengan kode visual — membantu
                  pengembang menciptakan pengalaman yang inklusif untuk semua pengguna.
                </p>
              </div>

              {/* Ilustrasi Aksesibel Figma */}
              <div className="h-32 rounded-2xl bg-white border border-gray-200 flex items-center justify-center p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
                    👁️
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-xs">
                    🧍
                  </div>
                </div>
              </div>
            </div>

            {/* Fitur 2: Dirancang Fleksibel */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Dirancang Fleksibel
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Pustaka open-source yang mudah disesuaikan dengan kebutuhanmu.
                  Dilengkapi API, generator, dan integrasi, Blockly cocok untuk berbagai platform dan lingkungan.
                </p>
              </div>

              {/* Ilustrasi Fleksibel Figma */}
              <div className="h-32 rounded-2xl bg-white border border-gray-200 flex items-center justify-center p-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-blue-100 text-blue-700 font-mono text-xs font-bold rounded-lg border border-blue-200">
                    &lt;code&gt;
                  </div>
                  <span className="text-gray-300">⇄</span>
                  <div className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs">
                    🧩 Visual
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Maskot Robot Sesuai Figma */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between shadow-xl shadow-blue-600/20">
              <div>
                {/* Bubble Pesan Maskot Sesuai Figma */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/60 rounded-xl text-xs font-bold mb-4 backdrop-blur-xs border border-blue-400/40">
                  <span>Pesan:</span>
                  <span>Hi, Aku RoboNusa! 🤖</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">
                  Siap Belajar Logika Pemrograman?
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-6">
                  Pelajari logika komputer melalui gerak robot virtual, sensor jarak, dan rintangan arena.
                </p>
              </div>

              <a
                href="/robokreasi"
                className="w-full py-3 bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-sm rounded-xl text-center transition-colors shadow-md cursor-pointer"
              >
                Buka Workspace RoboKreasi 🚀
              </a>
            </div>
          </div>
        </section>

        {/* ─── Footer Sesuai Figma ─────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 bg-gray-50 py-6 px-6 text-xs text-gray-500">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">RoboNusa!</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} Racer Robotic. Berkreasi dengan Racero Scratch.</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span>🇮🇩 Bahasa Indonesia</span>
              <span>•</span>
              <a href="/robokreasi" className="text-blue-600 font-semibold hover:underline">
                Ruang Pemrograman
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
