import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';

// ─── Tipe Data ───────────────────────────────────────────────────────────────

export interface ExampleProject {
  id: number;
  name: string;
  slug: string;
  description: string;
  difficulty: 'pemula' | 'menengah' | 'mahir';
  thumbnail: string | null;
  workspace_json: Record<string, unknown> | null;
  sort_order: number;
  tags?: string[];
  estimated_minutes?: number;
}

interface Props {
  exampleProjects?: ExampleProject[];
}

// ─── 5 Proyek Contoh Default Sesuai Desain Figma ─────────────────────────────

const FIGMA_EXAMPLE_PROJECTS: ExampleProject[] = [
  {
    id: 1,
    name: 'Robot Pemilih Jalur',
    slug: 'robot-pemilih-jalur',
    description: 'Bantu robot memilih arah di persimpangan menggunakan kondisi jika-maka.',
    difficulty: 'menengah',
    thumbnail: null,
    workspace_json: null,
    sort_order: 1,
    tags: ['Logika & sensor'],
    estimated_minutes: 15,
  },
  {
    id: 2,
    name: 'Robot Menghindari Rintangan',
    slug: 'menghindari-rintangan-virtual',
    description: 'Gunakan sensor jarak agar robot dapat berbelok sebelum menabrak benda.',
    difficulty: 'pemula',
    thumbnail: null,
    workspace_json: null,
    sort_order: 2,
    tags: ['Sensor jarak'],
    estimated_minutes: 10,
  },
  {
    id: 3,
    name: 'Robot Mengikuti Garis',
    slug: 'robot-mengikuti-garis',
    description: 'Arahkan robot mengikuti garis dengan membaca sensor dan menyesuaikan gerakan.',
    difficulty: 'menengah',
    thumbnail: null,
    workspace_json: null,
    sort_order: 3,
    tags: ['Sensor & perulangan'],
    estimated_minutes: 20,
  },
  {
    id: 4,
    name: 'Program Hitung Mundur Interaktif',
    slug: 'hitung-mundur-interaktif',
    description: 'Susun hitungan dari 3 hingga 1, lalu beri tanda saat robot siap bergerak.',
    difficulty: 'pemula',
    thumbnail: null,
    workspace_json: null,
    sort_order: 4,
    tags: ['Variabel & waktu'],
    estimated_minutes: 10,
  },
  {
    id: 5,
    name: 'Robot Bergerak Membentuk Pola',
    slug: 'robot-bergerak-membentuk-pola',
    description: 'Ulangi gerak maju dan putaran untuk membuat jalur berbentuk persegi.',
    difficulty: 'pemula',
    thumbnail: null,
    workspace_json: null,
    sort_order: 5,
    tags: ['Gerak & perulangan'],
    estimated_minutes: 15,
  },
];

const DIFFICULTY_LABELS: Record<string, string> = {
  pemula: 'Pemula',
  menengah: 'Menengah',
  mahir: 'Mahir',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  pemula: 'bg-teal-50 text-teal-800 border border-teal-200',
  menengah: 'bg-amber-50 text-amber-800 border border-amber-200',
  mahir: 'bg-red-50 text-red-800 border border-red-200',
};

// ─── Thumbnail SVG Presisi Sesuai Figma ──────────────────────────────────────

function RobotIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-14" y="-18" width="28" height="36" rx="6" fill="#0d9488" />
      <circle cx="-6" cy="-8" r="3" fill="#ffffff" />
      <circle cx="6" cy="-8" r="3" fill="#ffffff" />
      <rect x="-8" y="2" width="16" height="4" rx="2" fill="#5eead4" />
      <path d="M0 10 L-4 16 L4 16 Z" fill="#ffffff" />
    </g>
  );
}

function ThumbnailPlaceholder({ slug }: { slug: string }) {
  const gridPattern = (
    <pattern id={`grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e6f2f0" strokeWidth="0.8" />
    </pattern>
  );

  if (slug.includes('jalur') || slug.includes('pemilih')) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        <defs>{gridPattern}</defs>
        <rect width="300" height="140" fill="#f8fdfc" />
        <rect width="300" height="140" fill={`url(#grid-${slug})`} />
        {/* Y-Split Path */}
        <line x1="80" y1="105" x2="140" y2="65" stroke="#99f6e4" strokeWidth="3" strokeDasharray="6,4" />
        <line x1="140" y1="65" x2="220" y2="35" stroke="#99f6e4" strokeWidth="3" strokeDasharray="6,4" />
        <line x1="140" y1="65" x2="110" y2="30" stroke="#99f6e4" strokeWidth="3" strokeDasharray="6,4" />
        <RobotIcon x={80} y={105} />
      </svg>
    );
  }

  if (slug.includes('rintangan')) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        <defs>{gridPattern}</defs>
        <rect width="300" height="140" fill="#f8fdfc" />
        <rect width="300" height="140" fill={`url(#grid-${slug})`} />
        {/* Rintangan Kotak Orange X */}
        <g transform="translate(130, 35)">
          <rect width="34" height="34" rx="6" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
          <line x1="9" y1="9" x2="25" y2="25" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="9" x2="9" y2="25" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Jalur Menghindar Melengkung */}
        <path d="M 147 105 C 147 80, 200 80, 200 45" stroke="#99f6e4" strokeWidth="3" strokeDasharray="6,4" fill="none" />
        <RobotIcon x={147} y={105} />
      </svg>
    );
  }

  if (slug.includes('garis')) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        <defs>{gridPattern}</defs>
        <rect width="300" height="140" fill="#f8fdfc" />
        <rect width="300" height="140" fill={`url(#grid-${slug})`} />
        {/* Track Garis Hitam Tebal */}
        <path
          d="M 60 100 L 110 100 C 170 100, 160 40, 220 40 L 245 40"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <RobotIcon x={60} y={100} />
      </svg>
    );
  }

  if (slug.includes('hitung')) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        <rect width="300" height="140" fill="#f8fdfc" />
        <g transform="translate(70, 20)">
          <rect width="160" height="100" rx="16" fill="#1e293b" />
          <text x="80" y="70" fontSize="56" fill="#ffffff" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            3
          </text>
        </g>
      </svg>
    );
  }

  if (slug.includes('pola') || slug.includes('persegi')) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
        <defs>{gridPattern}</defs>
        <rect width="300" height="140" fill="#f8fdfc" />
        <rect width="300" height="140" fill={`url(#grid-${slug})`} />
        {/* Persegi Jalur Putus-putus */}
        <rect
          x="100"
          y="30"
          width="130"
          height="80"
          rx="4"
          stroke="#99f6e4"
          strokeWidth="3"
          strokeDasharray="6,4"
          fill="none"
        />
        <RobotIcon x={100} y={110} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 140" className="w-full h-full" fill="none">
      <defs>{gridPattern}</defs>
      <rect width="300" height="140" fill="#f8fdfc" />
      <rect width="300" height="140" fill={`url(#grid-${slug})`} />
      <RobotIcon x={150} y={70} />
    </svg>
  );
}

// ─── Komponen Halaman Contoh Proyek ──────────────────────────────────────────

export default function ExampleProjects({ exampleProjects = [] }: Props) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('semua');

  // Gabungkan proyek dari DB dengan default Figma agar selalu lengkap 5 proyek
  const allProjects = useMemo(() => {
    const list = [...exampleProjects];
    for (const figmaProj of FIGMA_EXAMPLE_PROJECTS) {
      if (!list.some((p) => p.slug === figmaProj.slug)) {
        list.push(figmaProj);
      }
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }, [exampleProjects]);

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchDiff =
        difficultyFilter === 'semua' || p.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    });
  }, [allProjects, search, difficultyFilter]);

  function handleOpenProject(project: ExampleProject) {
    router.visit(`/robokreasi?example=${project.slug}`);
  }

  function handleNewProject() {
    router.visit('/robokreasi');
  }

  return (
    <div className="min-h-screen bg-[#FBFDFD] flex flex-col font-sans text-gray-900">
      {/* ─── Navbar Utama Figma ──────────────────────────────────────────── */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Nav Tabs */}
          <div className="flex items-center gap-8">
            <a href="/beranda" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white text-base shadow-sm group-hover:bg-teal-800 transition-colors">
                🤖
              </div>
              <span className="text-xl font-extrabold tracking-tight text-teal-800 font-sans">
                RoboNusa!
              </span>
            </a>

            {/* Menu Navigasi Utama */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="/beranda"
                className="text-gray-600 hover:text-teal-700 font-medium transition-colors"
              >
                Beranda
              </a>
              <span className="text-teal-800 font-bold border-b-2 border-teal-700 pb-1 cursor-default">
                Contoh Proyek
              </span>
            </div>
          </div>

          {/* Aksi Kanan Navbar */}
          <div className="flex items-center gap-3">
            <a
              href="/beranda"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-teal-800 transition-colors"
            >
              <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[11px] font-bold">
                ?
              </span>
              <span>Bantuan</span>
            </a>
            <button
              type="button"
              onClick={handleNewProject}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer shadow-teal-700/20"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Proyek baru</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Header & Filter Area ────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-8 pb-12">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-[11px] font-bold text-teal-700 uppercase tracking-widest mb-1.5">
              BELAJAR SAMBIL MENCOBA
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Contoh Proyek
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Pilih ide, jelajahi bloknya, lalu buat versimu sendiri. Ayo mulai!
            </p>
          </div>

          {/* Badge Ide Figma */}
          <div className="flex items-center gap-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl px-4 py-3">
            <span className="text-teal-600 text-xl">✨</span>
            <div>
              <p className="text-xs font-bold text-teal-900">
                5 ide untuk penjelajah muda
              </p>
              <p className="text-[11px] text-teal-700">
                Semua proyek bisa diubah dan disimpan.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Pencarian & Filter ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari contoh proyek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs"
              />
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
            >
              <option value="semua">Semua tingkat</option>
              <option value="pemula">Pemula</option>
              <option value="menengah">Menengah</option>
              <option value="mahir">Mahir</option>
            </select>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            Menampilkan {filtered.length} proyek
          </span>
        </div>

        {/* ─── Grid Kartu Proyek ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const minutes = project.estimated_minutes ?? 15;
            const diffLabel = DIFFICULTY_LABELS[project.difficulty] ?? project.difficulty;
            const diffColor = DIFFICULTY_COLORS[project.difficulty] ?? 'bg-gray-100 text-gray-700';

            return (
              <div
                key={project.id || project.slug}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="h-[140px] bg-teal-50/30 relative border-b border-gray-100">
                  <ThumbnailPlaceholder slug={project.slug} />
                  <span className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-mono bg-white/70 px-1.5 py-0.5 rounded">
                    1 petak = 10 cm
                  </span>
                </div>

                {/* Konten Kartu */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${diffColor}`}>
                      {diffLabel}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                      <span>⏱</span>
                      <span>{minutes} menit</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Tag Kategori */}
                  <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
                    {(project.tags || ['Logika & sensor']).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 border border-teal-100 rounded-lg px-2 py-0.5 font-medium"
                      >
                        <span>🧩</span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Tombol Buka Proyek */}
                  <button
                    type="button"
                    onClick={() => handleOpenProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>→</span>
                    <span>Buka Proyek</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Kartu Khusus: "Punya ide sendiri?" Sesuai Figma */}
          <div className="border border-teal-100 bg-[#F0FDF9] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-teal-100 flex items-center justify-center text-xl mb-4">
              💡
            </div>
            <h3 className="text-base font-extrabold text-teal-950 mb-2">
              Punya ide sendiri?
            </h3>
            <p className="text-xs text-teal-900/70 leading-relaxed mb-6 max-w-xs">
              Mulai dari kanvas kosong. Gabungkan gerakan, sensor, dan imajinasimu untuk membuat robot yang unik.
            </p>
            <button
              type="button"
              onClick={handleNewProject}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer mb-3"
            >
              + Buat proyek baru
            </button>
            <a
              href="/beranda"
              className="text-[11px] text-teal-700 hover:underline font-medium"
            >
              Butuh panduan? Buka tur dari menu Bantuan.
            </a>
          </div>
        </div>
      </main>

      {/* ─── Footer Bawah Sesuai Figma ──────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center gap-1.5 text-[11px]">
          <span>📥</span>
          <span>
            Proyek contoh tidak mengubah file aslimu. Simpan hasil kreasimu ke komputer saat sudah selesai.
          </span>
        </p>
      </footer>
    </div>
  );
}
