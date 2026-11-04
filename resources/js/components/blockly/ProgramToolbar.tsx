/**
 * RoboKreasi — Toolbar & Header Navigasi Hijau Alami
 * Menu dropdown PictoBlox / Scratch (File, Edit, Panduan/Belajar)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ProgramStatus } from '../../types/robokreasi';

interface ProgramToolbarProps {
  programStatus?: ProgramStatus;
  canUndo: boolean;
  canRedo: boolean;
  errorMessage: string | null;
  projectName: string;
  onRun?: () => void;
  onStop?: () => void;
  onReset?: () => void;
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
  canUndo,
  canRedo,
  errorMessage,
  projectName,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onProjectNameChange,
  onOpenGuide,
  onOpenExamplesModal,
  onNavigateHome,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'learn' | null>(null);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar area menu atau tombol Escape ditekan
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNameSubmit = useCallback(() => {
    const name = tempName.trim() || 'Proyek Saya';
    onProjectNameChange(name);
    setIsEditingName(false);
  }, [tempName, onProjectNameChange]);

  const handleExport = useCallback(() => {
    onExport(projectName);
  }, [projectName, onExport]);

  const toggleMenu = (menu: 'file' | 'edit' | 'learn') => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMouseEnterMenu = (menu: 'file' | 'edit' | 'learn') => {
    if (openMenu !== null) {
      setOpenMenu(menu);
    }
  };

  return (
    <div
      className={`w-full ${
        isDarkMode ? 'bg-[#064E3B] border-emerald-950' : 'bg-emerald-600 border-emerald-700'
      } text-white border-b select-none shadow-xs transition-colors`}
    >
      {/* ─── Baris Navigasi Tunggal Alami (Sedikit Lebih Besar Sesuai Permintaan) ───── */}
      <div className="px-5 py-2.5 sm:py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Sisi Kiri: Logo Brand, Navigasi Beranda, Menus (File, Edit, Panduan/Belajar), & Nama Proyek */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          {/* Logo Brand: Tanpa emoji robot, teks RoboNusa! diperbesar */}
          <div className="flex items-center mr-1">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              RoboNusa!
            </span>
          </div>

          {/* Tombol Beranda */}
          {onNavigateHome ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Kembali ke Beranda"
            >
              <span>←</span>
              <span>Beranda</span>
            </button>
          ) : (
            <a
              href="/beranda"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Beranda</span>
            </a>
          )}

          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          {/* ─── Menu Dropdown PictoBlox (File, Edit, Panduan/Belajar) ─────────── */}
          <div ref={menuContainerRef} className="flex items-center gap-1 text-xs">
            {/* Menu: File */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('file')}
                onMouseEnter={() => handleMouseEnterMenu('file')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  openMenu === 'file'
                    ? 'bg-white/25 text-white shadow-inner'
                    : 'text-white/95 hover:text-white hover:bg-white/15'
                }`}
                title="Menu File"
              >
                <span>File</span>
                <span className="text-[9px] opacity-70">▼</span>
              </button>

              {openMenu === 'file' && (
                <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    id="btn-open-project"
                    onClick={() => {
                      onImport();
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                  >
                    <span>📂</span>
                    <span className="font-medium">Buka proyek</span>
                  </button>
                  <button
                    type="button"
                    id="btn-save-project"
                    onClick={() => {
                      handleExport();
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                  >
                    <span>💾</span>
                    <span className="font-medium">Simpan proyek</span>
                  </button>
                </div>
              )}
            </div>

            {/* Menu: Edit */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('edit')}
                onMouseEnter={() => handleMouseEnterMenu('edit')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  openMenu === 'edit'
                    ? 'bg-white/25 text-white shadow-inner'
                    : 'text-white/95 hover:text-white hover:bg-white/15'
                }`}
                title="Menu Edit"
              >
                <span>Edit</span>
                <span className="text-[9px] opacity-70">▼</span>
              </button>

              {openMenu === 'edit' && (
                <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    id="menu-undo"
                    onClick={() => {
                      if (canUndo) {
                        onUndo();
                        setOpenMenu(null);
                      }
                    }}
                    disabled={!canUndo}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                      canUndo
                        ? 'hover:bg-gray-100 text-gray-800 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>↩️</span>
                      <span className="font-medium">Urungkan</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Ctrl+Z</span>
                  </button>
                  <button
                    type="button"
                    id="menu-redo"
                    onClick={() => {
                      if (canRedo) {
                        onRedo();
                        setOpenMenu(null);
                      }
                    }}
                    disabled={!canRedo}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                      canRedo
                        ? 'hover:bg-gray-100 text-gray-800 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>↪️</span>
                      <span className="font-medium">Ulangi</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Ctrl+Y</span>
                  </button>
                </div>
              )}
            </div>

            {/* Menu: Panduan/Belajar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('learn')}
                onMouseEnter={() => handleMouseEnterMenu('learn')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  openMenu === 'learn'
                    ? 'bg-white/25 text-white shadow-inner'
                    : 'text-white/95 hover:text-white hover:bg-white/15'
                }`}
                title="Menu Panduan / Belajar"
              >
                <span>Panduan/Belajar</span>
                <span className="text-[9px] opacity-70">▼</span>
              </button>

              {openMenu === 'learn' && (
                <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {onOpenExamplesModal && (
                    <button
                      type="button"
                      id="btn-example-projects"
                      onClick={() => {
                        onOpenExamplesModal();
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                    >
                      <span>💡</span>
                      <span className="font-medium">Contoh Proyek</span>
                    </button>
                  )}
                  {onOpenGuide && (
                    <button
                      type="button"
                      id="btn-guide-tour"
                      onClick={() => {
                        onOpenGuide();
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                    >
                      <span>📖</span>
                      <span className="font-medium">Panduan</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          {/* Nama Dokumen Proyek (Kotak Bergaya PictoBlox) */}
          <div className="flex items-center gap-1.5">
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
                className="text-xs font-bold px-3 py-1 rounded-lg border-2 border-white focus:outline-none bg-emerald-800 text-white shadow-inner"
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
                className="text-xs font-bold transition-all flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/50 shadow-2xs"
                title="Klik untuk mengubah nama proyek"
              >
                <span>{projectName}</span>
                <span className="text-[10px] text-white/70">✏️</span>
              </button>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Pengaturan (Mode Gelap) */}
        <div className="flex items-center gap-2">
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          )}
        </div>
      </div>

      {/* Banner Pesan Kesalahan jika ada */}
      {errorMessage && (
        <div className="px-5 py-2 bg-red-600 text-white text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramToolbar;
