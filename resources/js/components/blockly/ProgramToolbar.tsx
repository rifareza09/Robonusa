/**
 * RoboKreasi — Toolbar & Header Program Tema PictoBlox RoboNusa (#37BD71)
 * Desain profesional dengan sistem Dropdown Menu (Berkas, Edit, Bantuan) ala PictoBlox & Scratch
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ProgramStatus } from '../../types/robokreasi';

interface ProgramToolbarProps {
  programStatus: ProgramStatus;
  canUndo: boolean;
  canRedo: boolean;
  errorMessage: string | null;
  projectName: string;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (name: string) => void;
  onImport: () => void;
  onProjectNameChange: (name: string) => void;
  onOpenGuide?: () => void;
  onOpenExamplesModal?: () => void;
  onNavigateHome?: () => void;
  isSavedLocally?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

type DropdownKey = 'berkas' | 'edit' | 'bantuan' | null;

export const ProgramToolbar: React.FC<ProgramToolbarProps> = ({
  programStatus,
  canUndo,
  canRedo,
  errorMessage,
  projectName,
  onRun,
  onStop,
  onReset,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onProjectNameChange,
  onOpenGuide,
  onOpenExamplesModal,
  onNavigateHome,
  isSavedLocally = false,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const isRunning = programStatus === 'running';

  // Tutup dropdown saat klik di luar atau tekan tombol Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (key: DropdownKey) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleNameSubmit = useCallback(() => {
    const name = tempName.trim() || 'Proyek Saya';
    onProjectNameChange(name);
    setIsEditingName(false);
  }, [tempName, onProjectNameChange]);

  const handleExport = useCallback(() => {
    onExport(projectName);
  }, [projectName, onExport]);

  // Konfigurasi Status Pill bergaya Frosted Glass di atas navbar #37BD71
  const statusConfig: Record<ProgramStatus, { label: string; icon: string; className: string }> = {
    idle: {
      label: 'Siap',
      icon: '▶',
      className: 'bg-white/20 text-white border-white/30',
    },
    running: {
      label: 'Berjalan',
      icon: '⚡',
      className: 'bg-emerald-300/30 text-emerald-100 border-emerald-200/50 animate-pulse',
    },
    stopped: {
      label: 'Dihentikan',
      icon: '⏹',
      className: 'bg-amber-300/30 text-amber-100 border-amber-200/50',
    },
    finished: {
      label: 'Selesai',
      icon: '✅',
      className: 'bg-white/30 text-white border-white/40',
    },
    error: {
      label: 'Kesalahan',
      icon: '⚠️',
      className: 'bg-red-400/30 text-red-100 border-red-200/50',
    },
  };

  const status = statusConfig[programStatus] || statusConfig.idle;

  return (
    <div ref={toolbarRef} className="flex flex-col text-left text-white relative select-none">
      {/* ─── Top Navbar Ala PictoBlox Solid Tema Hijau #37BD71 ──────────────── */}
      <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2.5">
        {/* Kolom Kiri: Logo Brand & Dropdown Menu (Berkas, Edit, Bantuan) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Logo Brand PictoBlox-style */}
          <div className="flex items-center gap-2 mr-1">
            <span className="text-xl drop-shadow-xs">🤖</span>
            <span className="text-lg font-black tracking-tight text-white font-sans drop-shadow-xs">
              RoboNusa!
            </span>
          </div>

          <div className="h-5 w-px bg-white/25 hidden sm:block mx-1" />

          {/* Navigasi Dropdown Menubar (Gaya PictoBlox: File | Edit | Learn) */}
          <div className="flex items-center gap-1 text-xs">
            {/* ── 1. Dropdown Berkas (File) ── */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('berkas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeDropdown === 'berkas'
                    ? 'bg-white text-[#1E7341] shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Menu Berkas Proyek"
              >
                <span>Berkas</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === 'berkas' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'berkas' && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  {/* Buka Proyek */}
                  <button
                    id="btn-open-project"
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null);
                      onImport();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">📂</span>
                      <div>
                        <div className="font-bold text-gray-900">Buka Proyek...</div>
                        <div className="text-[10px] text-gray-500">Muat dari komputer (.json)</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">Ctrl+O</span>
                  </button>

                  {/* Simpan Proyek */}
                  <button
                    id="btn-save-project-menu"
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null);
                      handleExport();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">💾</span>
                      <div>
                        <div className="font-bold text-gray-900">Simpan Proyek...</div>
                        <div className="text-[10px] text-gray-500">Unduh ke perangkat (.json)</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">Ctrl+S</span>
                  </button>

                  <div className="my-1.5 border-t border-gray-100" />

                  {/* Kembali ke Beranda */}
                  {onNavigateHome ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        onNavigateHome();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer text-gray-700"
                    >
                      <span className="text-base">🏠</span>
                      <div>
                        <div className="font-bold text-gray-900">Kembali ke Beranda</div>
                        <div className="text-[10px] text-gray-500">Halaman utama RoboKreasi</div>
                      </div>
                    </button>
                  ) : (
                    <a
                      href="/beranda"
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer text-gray-700"
                    >
                      <span className="text-base">🏠</span>
                      <div>
                        <div className="font-bold text-gray-900">Kembali ke Beranda</div>
                        <div className="text-[10px] text-gray-500">Halaman utama RoboKreasi</div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── 2. Dropdown Edit ── */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeDropdown === 'edit'
                    ? 'bg-white text-[#1E7341] shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Menu Edit & Urungkan"
              >
                <span>Edit</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === 'edit' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'edit' && (
                <div className="absolute left-0 top-full mt-1.5 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  {/* Batal / Undo */}
                  <button
                    type="button"
                    disabled={!canUndo}
                    onClick={() => {
                      setActiveDropdown(null);
                      onUndo();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>↩</span>
                      <span className="font-bold">Batal (Undo)</span>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">Ctrl+Z</span>
                  </button>

                  {/* Ulangi / Redo */}
                  <button
                    type="button"
                    disabled={!canRedo}
                    onClick={() => {
                      setActiveDropdown(null);
                      onRedo();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>↪</span>
                      <span className="font-bold">Ulangi (Redo)</span>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">Ctrl+Y</span>
                  </button>

                  <div className="my-1.5 border-t border-gray-100" />

                  {/* Reset Robot */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null);
                      onReset();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer text-gray-700"
                  >
                    <span>🔄</span>
                    <div>
                      <div className="font-bold text-gray-900">Reset Simulator</div>
                      <div className="text-[10px] text-gray-500">Kembalikan robot ke awal</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ── 3. Dropdown Bantuan (Learn / Help) ── */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('bantuan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeDropdown === 'bantuan'
                    ? 'bg-white text-[#1E7341] shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Menu Contoh Proyek & Panduan"
              >
                <span>Bantuan</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === 'bantuan' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'bantuan' && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  {/* Contoh Proyek */}
                  {onOpenExamplesModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        onOpenExamplesModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer"
                    >
                      <span className="text-base">📚</span>
                      <div>
                        <div className="font-bold text-gray-900">Contoh Proyek</div>
                        <div className="text-[10px] text-gray-500">Pilih proyek latihan siap pakai</div>
                      </div>
                    </button>
                  )}

                  {/* Panduan Interaktif */}
                  {onOpenGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        onOpenGuide();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left hover:bg-[#E8F8F0] hover:text-[#1E7341] transition-colors cursor-pointer"
                    >
                      <span className="text-base">📖</span>
                      <div>
                        <div className="font-bold text-gray-900">Tur Panduan</div>
                        <div className="text-[10px] text-gray-500">Panduan interaktif 3 langkah</div>
                      </div>
                    </button>
                  )}

                  <div className="my-1.5 border-t border-gray-100" />

                  {/* Tentang */}
                  <div className="px-3.5 py-2 text-[11px] text-gray-400">
                    <span className="font-bold text-gray-600 block">RoboKreasi Studio</span>
                    <span>Versi Pemrograman Visual v1.0</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Tengah: Kotak Nama Proyek (PictoBlox "My Project" Style) & Quick Save 💾 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-[#237C47] hover:bg-[#1E6C3E] border border-white/20 rounded-xl px-3 py-1.5 shadow-inner transition-colors">
            {isEditingName ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                  if (e.key === 'Escape') {
                    setTempName(projectName);
                    setIsEditingName(false);
                  }
                }}
                className="bg-white text-gray-900 font-bold rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-white border-none"
                autoFocus
                maxLength={80}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempName(projectName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-1.5 text-left text-white text-xs font-bold hover:text-emerald-100 transition-colors group cursor-pointer"
                title="Klik untuk mengubah nama proyek"
              >
                <span className="truncate max-w-[130px] sm:max-w-[200px]">{projectName}</span>
                <span className="text-white/70 group-hover:text-white text-[10px]">✏️</span>
              </button>
            )}
          </div>

          {/* Tombol Simpan Cepat Ala PictoBlox (Floppy Disk di samping nama proyek) */}
          <button
            id="btn-save-project"
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center w-8 h-8 bg-[#237C47] hover:bg-[#1E6C3E] active:scale-95 text-white text-sm font-bold rounded-xl border border-white/20 shadow-inner transition-all cursor-pointer"
            title="Simpan proyek ke komputer (.robonusa.json)"
          >
            <span>💾</span>
          </button>
        </div>

        {/* Kolom Kanan: Quick Actions (Undo/Redo, Reset), Eksekusi (Mulai/Berhenti), Status & Tema */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Undo / Redo */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="px-2 py-1 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
              title="Urungkan aksi terakhir (Ctrl+Z)"
            >
              <span>↩</span>
              <span className="text-[11px]">Batal</span>
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="px-2 py-1 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
              title="Ulangi aksi (Ctrl+Y)"
            >
              <span>↪</span>
              <span className="text-[11px]">Ulangi</span>
            </button>
          </div>

          {/* Quick Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Kembalikan robot ke posisi awal"
          >
            <span>🔄</span>
            <span className="hidden xl:inline">Reset</span>
          </button>

          {/* Tombol Jalankan / Hentikan (Primary Action CTA) */}
          {isRunning ? (
            <button
              id="btn-stop-program"
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-red-900/20"
              title="Hentikan simulasi program"
            >
              <span>⏹</span>
              <span>Berhenti</span>
            </button>
          ) : (
            <button
              id="btn-run-program"
              type="button"
              onClick={onRun}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 text-[#1E7341] text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-950/20"
              title="Jalankan program pada simulator robot"
            >
              <span>▶</span>
              <span>Mulai</span>
            </button>
          )}

          {/* Status Badge Glass */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${status.className}`}
          >
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>

          {/* Mode Gelap / Terang */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-xl transition-colors cursor-pointer"
              title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner Kesalahan jika ada */}
      {errorMessage && (
        <div className="px-4 py-2 bg-red-600 text-white text-xs font-semibold flex items-center gap-2 border-t border-red-700 animate-in fade-in">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProgramToolbar;
