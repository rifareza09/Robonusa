/**
 * RoboKreasi — Modal Simpan Proyek ke Komputer
 * Mengacu pada desain Figma: "Simpan proyek ke komputer.png" & "Workspace • Simpan proyek.png"
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
    const trimmed = projectName.trim() || 'proyek-saya';
    onSave(trimmed);
    onClose();
  };

  const slug = (projectName.trim() || 'proyek-saya')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150 text-left">
        {/* Header Modal */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Simpan proyek ke komputer
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Unduh berkas proyek ke komputer. Tidak ada penyimpanan otomatis atau cloud.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold transition-colors cursor-pointer"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {/* Input nama berkas */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Nama berkas
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-gray-900"
              placeholder="Masukkan nama berkas..."
              maxLength={80}
              autoFocus
            />
            <p className="text-xs font-mono text-gray-500 mt-1.5">
              {slug}.robonusa.json
            </p>
          </div>

          {/* Info Card Berkas Sesuai Figma */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">JSON proyek • .robonusa.json</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Tujuan: komputer lokal melalui peramban.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Belum diunduh. Unduhan yang disiapkan belum membuktikan berkas tersimpan. Periksa folder unduhanmu.
          </p>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Unduh berkas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
