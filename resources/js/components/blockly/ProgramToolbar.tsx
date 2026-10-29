/**
 * RoboKreasi — Toolbar & Header Program
 * Mengacu pada desain Figma: "Ruang pemrograman • Desktop terang.png" & "Kit desain • RoboNusa.png"
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
  isSavedLocally?: boolean;
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
  isSavedLocally = false,
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

  // Konfigurasi Status Pill sesuai Figma Kit Desain
  const statusConfig: Record<ProgramStatus, { label: string; icon: string; className: string }> = {
    idle: {
      label: 'Siap',
      icon: '▶',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    running: {
      label: 'Berjalan',
      icon: '▶',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse',
    },
    stopped: {
      label: 'Dihentikan',
      icon: '⏹',
      className: 'bg-amber-50 text-amber-700 border-amber-300',
    },
    finished: {
      label: 'Selesai',
      icon: '✅',
      className: 'bg-green-50 text-green-700 border-green-300',
    },
    error: {
      label: 'Kesalahan',
      icon: '⚠️',
      className: 'bg-red-50 text-red-700 border-red-300',
    },
  };

  const status = statusConfig[programStatus] || statusConfig.idle;

  return (
    <div className="flex flex-col text-left">
      {/* ─── Baris 1: Navbar Utama Figma ──────────────────────────────────── */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 flex-wrap gap-2">
        {/* Brand & Judul Proyek */}
        <div className="flex items-center gap-3">
          {/* Logo RoboNusa & Racer Robotic */}
          <div className="flex items-center gap-2">
            <img
              src="/images/logo_racer.png"
              alt="Racer Robotic"
              className="h-7 w-auto object-contain hidden sm:block"
              onError={(e) => {
                // Sembunyikan jika gambar belum ter-render
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-extrabold tracking-tight text-blue-600 font-sans">
              RoboNusa!
            </span>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Edit Nama Proyek */}
          <div className="flex flex-col">
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
                className="bg-gray-100 text-gray-900 font-bold rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-300"
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
                className="flex items-center gap-1.5 text-left text-gray-900 text-sm font-bold hover:text-blue-600 transition-colors group"
                title="Klik untuk mengubah nama proyek"
              >
                <span>{projectName}</span>
                <span className="text-gray-400 group-hover:text-blue-500 text-xs">✏️</span>
              </button>
            )}
            <span className="text-[11px] text-gray-400">
              {isSavedLocally ? 'Tersimpan secara lokal' : 'Perubahan belum diunduh'}
            </span>
          </div>
        </div>

        {/* Action Buttons Navbar (Buka Proyek, Simpan Proyek, Panduan) */}
        <div className="flex items-center gap-2">
          {/* Tombol Buka Proyek */}
          <button
            id="btn-open-project"
            type="button"
            onClick={onImport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors shadow-sm"
            title="Buka berkas proyek dari komputer"
          >
            <span>📂</span>
            <span>Buka proyek</span>
          </button>

          {/* Tombol Simpan Proyek */}
          <button
            id="btn-save-project"
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-blue-500/20"
            title="Unduh proyek ke komputer"
          >
            <span>📥</span>
            <span>Simpan proyek</span>
          </button>

          {/* Tombol Panduan */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors shadow-sm"
              title="Buka panduan belajar"
            >
              <span>📖</span>
              <span>Panduan</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Baris 2: Subheader & Status Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
        {/* Title Subheader */}
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">
            Ruang pemrograman
          </h1>
          <p className="text-[11px] text-gray-500">
            Contoh desain • Simulasi virtual
          </p>
        </div>

        {/* Kontrol & Status */}
        <div className="flex items-center gap-2">
          {/* Tombol Contoh Proyek Modal */}
          {onOpenExamplesModal && (
            <button
              type="button"
              onClick={onOpenExamplesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
              title="Pilih proyek contoh untuk latihan"
            >
              <span>📚</span>
              <span>Contoh Proyek</span>
            </button>
          )}

          {/* Status Badge Pill (Sesuai Figma) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${status.className}`}
          >
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Tombol Cepat: Mulai / Berhenti & Reset (Kompatibel dengan pengujian) */}
          <div className="flex items-center gap-1.5">
            {isRunning ? (
              <button
                id="btn-stop-program"
                type="button"
                onClick={onStop}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                title="Hentikan simulasi"
              >
                <span>⏹</span>
                <span>Berhenti</span>
              </button>
            ) : (
              <button
                id="btn-run-program"
                type="button"
                onClick={onRun}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors shadow-emerald-500/20"
                title="Jalankan simulasi"
              >
                <span>▶</span>
                <span>Mulai</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              title="Kembalikan robot ke posisi awal"
            >
              <span>🔄</span>
              <span>Reset</span>
            </button>
          </div>

          {/* Undo / Redo Tombol Cepat */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
              title="Urungkan (Ctrl+Z)"
            >
              ↩ Batal
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
              title="Ulangi (Ctrl+Y)"
            >
              ↪ Ulangi
            </button>
          </div>
        </div>
      </div>

      {/* Pesan Error Banner (jika ada kesalahan) */}
      {errorMessage && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProgramToolbar;
