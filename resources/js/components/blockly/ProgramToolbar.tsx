/**
 * RoboKreasi — Toolbar & Header Navigasi Panggung
 * Desain presisi mengacu pada antarmuka PictoBlox ("media_1793772443856_cdb78afb.png")
 */

import React, { useState, useCallback } from 'react';
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
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);

  const isRunning = programStatus === 'running';

  const handleNameSubmit = useCallback(() => {
    const name = tempName.trim() || 'Proyek Saya';
    onProjectNameChange(name);
    setIsEditingName(false);
  }, [tempName, onProjectNameChange]);

  const handleExport = useCallback(() => {
    onExport(projectName);
  }, [projectName, onExport]);

  return (
    <div className="w-full bg-[#4D1758] text-white select-none shadow-md">
      {/* ─── Baris Navigasi Utama PictoBlox ─────────────────────────────── */}
      <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        {/* Sisi Kiri: Brand & Menu Berkas / Edit / Belajar */}
        <div className="flex items-center gap-3">
          {/* Logo RoboNusa Style PictoBlox */}
          <div className="flex items-center gap-2 pr-1">
            <span className="w-8 h-8 rounded-xl bg-purple-900/80 border border-purple-400/40 flex items-center justify-center text-lg shadow-inner">
              🤖
            </span>
            <span className="text-lg font-black tracking-tight text-white font-sans drop-shadow-xs">
              RoboNusa
            </span>
          </div>

          <div className="h-5 w-px bg-purple-300/20 hidden md:block" />

          {/* Menu Dropdown PictoBlox Style */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {/* Berkas (File) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsFileMenuOpen(!isFileMenuOpen);
                  setIsEditMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                Berkas
              </button>
              {isFileMenuOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 py-1.5 w-44 z-50 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      onImport();
                      setIsFileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 text-xs flex items-center gap-2"
                  >
                    <span>📂</span>
                    <span>Buka dari Komputer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExport();
                      setIsFileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 text-xs flex items-center gap-2"
                  >
                    <span>💾</span>
                    <span>Simpan ke Komputer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsEditMenuOpen(!isEditMenuOpen);
                  setIsFileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                Edit
              </button>
              {isEditMenuOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 py-1.5 w-40 z-50 animate-in fade-in">
                  <button
                    type="button"
                    disabled={!canUndo}
                    onClick={() => {
                      onUndo();
                      setIsEditMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 disabled:opacity-40 text-xs flex items-center gap-2"
                  >
                    <span>↩</span>
                    <span>Batal</span>
                  </button>
                  <button
                    type="button"
                    disabled={!canRedo}
                    onClick={() => {
                      onRedo();
                      setIsEditMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 disabled:opacity-40 text-xs flex items-center gap-2"
                  >
                    <span>↪</span>
                    <span>Ulangi</span>
                  </button>
                </div>
              )}
            </div>

            {/* Contoh Proyek (Learn) */}
            {onOpenExamplesModal && (
              <button
                type="button"
                onClick={onOpenExamplesModal}
                className="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                Contoh Proyek
              </button>
            )}

            {/* Panduan */}
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                Panduan
              </button>
            )}
          </div>
        </div>

        {/* Bagian Tengah: Kapsul Judul Proyek & Simpan (PictoBlox Center Pill) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#38113F] border border-purple-400/40 rounded-xl px-3 py-1 shadow-inner">
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
                className="bg-transparent text-white font-bold text-xs focus:outline-none w-36 text-center"
                autoFocus
                maxLength={60}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempName(projectName);
                  setIsEditingName(true);
                }}
                className="text-xs font-bold text-white hover:text-purple-200 transition-colors truncate max-w-[150px] cursor-pointer"
                title="Klik untuk mengubah nama proyek"
              >
                {projectName}
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              className="ml-2 text-purple-200 hover:text-white transition-colors cursor-pointer"
              title="Simpan proyek ke komputer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 19V12H7v7h10zM7 5v4h8V5H7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Kontrol Jalankan, Batalkan, Pengaturan, Beranda */}
        <div className="flex items-center gap-2">
          {/* Tombol Eksekusi Cepat (Diperlukan oleh Unit Test) */}
          <div className="flex items-center gap-1.5">
            {isRunning ? (
              <button
                id="btn-stop-program"
                type="button"
                onClick={onStop}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Hentikan program"
              >
                <span>⏹</span>
                <span>Berhenti</span>
              </button>
            ) : (
              <button
                id="btn-run-program"
                type="button"
                onClick={onRun}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Jalankan program"
              >
                <span>▶</span>
                <span>Mulai</span>
              </button>
            )}

            {/* Tombol Batal & Ulangi Cepat (Diperlukan oleh Unit Test) */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-400/30 disabled:opacity-40 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Batal (Ctrl+Z)"
              >
                ↩ Batal
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-400/30 disabled:opacity-40 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Ulangi (Ctrl+Y)"
              >
                ↪ Ulangi
              </button>
            </div>
          </div>

          <div className="h-5 w-px bg-purple-300/20 mx-1 hidden sm:block" />

          {/* Ikon Contoh Proyek (Trophy) */}
          {onOpenExamplesModal && (
            <button
              type="button"
              onClick={onOpenExamplesModal}
              className="w-8 h-8 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-400/30 flex items-center justify-center text-sm transition-colors cursor-pointer"
              title="Contoh Proyek & Tantangan"
            >
              🏆
            </button>
          )}

          {/* Ikon Pengaturan Mode Gelap (Gear) */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-8 h-8 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-400/30 flex items-center justify-center text-sm transition-colors cursor-pointer"
              title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          )}

          {/* Tombol Beranda / Avatar Profil */}
          {onNavigateHome ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer ml-1"
              title="Kembali ke Beranda"
            >
              <span className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-[11px]">
                🤖
              </span>
              <span className="hidden sm:inline">Beranda</span>
            </button>
          ) : (
            <a
              href="/beranda"
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer ml-1"
              title="Kembali ke Beranda"
            >
              <span className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-[11px]">
                🤖
              </span>
              <span className="hidden sm:inline">Beranda</span>
            </a>
          )}
        </div>
      </div>

      {/* Banner Pesan Kesalahan jika ada */}
      {errorMessage && (
        <div className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramToolbar;
