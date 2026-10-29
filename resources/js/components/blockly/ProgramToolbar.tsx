/**
 * RoboKreasi — Komponen Toolbar Program
 * Tombol Mulai, Berhenti, Reset, Ekspor, Impor, Undo, Redo
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
    <div className="flex flex-col gap-2">
      {/* Baris 1: Nama proyek */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
        <span className="text-yellow-400 text-lg">🤖</span>
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
            className="flex-1 bg-gray-700 text-white rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
            maxLength={100}
          />
        ) : (
          <button
            onClick={() => {
              setTempName(projectName);
              setIsEditingName(true);
            }}
            className="flex-1 text-left text-white text-sm font-semibold hover:text-yellow-300 transition-colors"
            title="Klik untuk mengubah nama proyek"
          >
            {projectName}
            <span className="ml-1 text-gray-400 text-xs">✏️</span>
          </button>
        )}
        <span className="text-gray-400 text-xs">RoboKreasi v1</span>
      </div>

      {/* Baris 2: Tombol kontrol */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Tombol Mulai / Berhenti */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors shadow-md"
            title="Hentikan program (Berhenti)"
          >
            <span>⏹</span>
            <span>Berhenti</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-md"
            title="Jalankan program (Mulai)"
          >
            <span>▶</span>
            <span>Mulai</span>
          </button>
        )}

        {/* Tombol Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          title="Reset posisi robot ke tengah"
        >
          <span>🔄</span>
          <span>Reset</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold text-gray-700"
          title="Batalkan (Ctrl+Z)"
        >
          ↩ Batal
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold text-gray-700"
          title="Ulangi (Ctrl+Y)"
        >
          ↪ Ulangi
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Simpan dan Buka */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          title="Simpan proyek ke file JSON"
        >
          <span>💾</span>
          <span>Simpan</span>
        </button>
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors"
          title="Buka proyek dari file JSON"
        >
          <span>📂</span>
          <span>Buka</span>
        </button>
      </div>

      {/* Pesan Error */}
      {errorMessage && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Status berhasil */}
      {programStatus === 'finished' && !errorMessage && (
        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          ✅ Program selesai dijalankan!
        </div>
      )}
    </div>
  );
};

export default ProgramToolbar;

