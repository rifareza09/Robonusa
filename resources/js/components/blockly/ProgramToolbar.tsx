/**
 * RoboKreasi — Toolbar & Header Navigasi Alami (Clean & Natural)
 * Menghilangkan nesting card/kotak berlebih agar terlihat natural dan tidak artifisial.
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
    <div className={`w-full ${isDarkMode ? 'bg-[#1E293B] text-gray-100 border-gray-800' : 'bg-white text-gray-800 border-gray-200'} border-b select-none`}>
      {/* ─── Baris Navigasi Tunggal Alami ─────────────────────────────────── */}
      <div className="px-5 py-2.5 flex items-center justify-between flex-wrap gap-3">
        {/* Sisi Kiri: Logo, Navigasi Beranda, & Nama Dokumen Proyek */}
        <div className="flex items-center gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className={`text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              RoboNusa!
            </span>
          </div>

          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} hidden sm:block`} />

          {/* Tombol Beranda */}
          {onNavigateHome ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className={`text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>←</span>
              <span>Beranda</span>
            </button>
          ) : (
            <a
              href="/beranda"
              className={`text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>←</span>
              <span>Beranda</span>
            </a>
          )}

          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} hidden sm:block`} />

          {/* Nama Proyek (Teks alami seperti dokumen Google Docs / Figma) */}
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
                className={`text-xs font-bold px-1.5 py-0.5 border-b-2 border-blue-500 focus:outline-none bg-transparent ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
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
                className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-800 hover:text-blue-600'
                }`}
                title="Klik untuk mengubah nama proyek"
              >
                <span>{projectName}</span>
                <span className="text-[10px] text-gray-400">✏️</span>
              </button>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Menu Aksi Alami, Eksekusi, & Pengaturan */}
        <div className="flex items-center gap-2">
          {/* Menu Navigasi Utama (Teks bersih natural tanpa card-in-card) */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            {/* Buka Proyek */}
            <button
              id="btn-open-project"
              type="button"
              onClick={onImport}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Buka berkas proyek dari komputer"
            >
              <span>📂</span>
              <span>Buka proyek</span>
            </button>

            {/* Simpan Proyek */}
            <button
              id="btn-save-project"
              type="button"
              onClick={handleExport}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Simpan proyek ke komputer"
            >
              <span>💾</span>
              <span>Simpan proyek</span>
            </button>

            {/* Contoh Proyek */}
            {onOpenExamplesModal && (
              <button
                type="button"
                onClick={onOpenExamplesModal}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Buka contoh proyek"
              >
                <span>Contoh Proyek</span>
              </button>
            )}

            {/* Panduan */}
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Buka panduan"
              >
                <span>Panduan</span>
              </button>
            )}
          </div>

          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} hidden md:block mx-1`} />

          {/* Tombol Batal & Ulangi */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`px-2 py-1 text-xs font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Urungkan (Ctrl+Z)"
            >
              ↩ Batal
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`px-2 py-1 text-xs font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Ulangi (Ctrl+Y)"
            >
              ↪ Ulangi
            </button>
          </div>

          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mx-1`} />

          {/* Tombol Utama Mulai / Berhenti */}
          {isRunning ? (
            <button
              id="btn-stop-program"
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Jalankan program"
            >
              <span>▶</span>
              <span>Mulai</span>
            </button>
          )}

          {/* Mode Gelap / Terang */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ml-1 ${
                isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
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
