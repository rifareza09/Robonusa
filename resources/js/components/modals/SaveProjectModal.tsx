/**
 * RoboKreasi — Modal Simpan Proyek
 * Mengacu pada desain Figma: "Workspace • Simpan proyek.png"
 */

import React, { useState } from 'react';

interface SaveProjectModalProps {
  isOpen: boolean;
  initialProjectName: string;
  onClose: () => void;
  onSave: (projectName: string) => void;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  isOpen,
  initialProjectName,
  onClose,
  onSave,
}) => {
  const [projectName, setProjectName] = useState(initialProjectName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = projectName.trim() || 'Proyek Saya';
    onSave(trimmed);
    onClose();
  };

  const slug = (projectName.trim() || 'proyek-saya')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Simpan proyek</h2>
            <p className="text-xs text-gray-500 mt-1">
              Unduh berkas proyek ke komputer. Tidak ada penyimpanan otomatis atau cloud.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold transition-colors"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {/* Input nama proyek */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nama proyek
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-gray-800"
              placeholder="Masukkan nama proyek..."
              maxLength={80}
              autoFocus
            />
            <p className="text-xs font-mono text-gray-400 mt-1">
              {slug}.robonusa.json
            </p>
          </div>

          {/* Info Card Berkas */}
          <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-left">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-xs font-bold text-blue-900">Berkas proyek JSON</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Susunan blok, parameter, dan pilihan arena.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Belum diunduh. Setelah memilih &ldquo;Unduh file&rdquo;, simpan berkas melalui peramban.
          </p>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors shadow-blue-500/20"
            >
              <span>📥</span>
              <span>Unduh file</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

