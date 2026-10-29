/**
 * RoboKreasi — Modal Buka Proyek Lokal
 * Mengacu pada desain Figma: "Buka proyek lokal.png" & "Workspace • Buka proyek lokal.png"
 */

import React, { useRef, useState } from 'react';

interface OpenProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export const OpenProjectModal: React.FC<OpenProjectModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setPendingFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setPendingFile(file);
    }
  };

  const handleConfirm = () => {
    if (pendingFile) {
      onFileSelect(pendingFile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150 text-left">
        {/* Header Modal */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Buka proyek lokal
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Pilih berkas proyek dari komputer. Berkas asli tidak diubah saat dibuka.
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

        <div className="p-6 pt-3 space-y-4">
          {/* Dropzone Sesuai Figma */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-7 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-gray-300 hover:border-blue-400 bg-white'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".json,.robonusa.json,application/json"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-900">
              Tarik berkas proyek ke sini
            </p>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Format yang diterima: .robonusa.json
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-2xs transition-colors cursor-pointer"
            >
              Pilih berkas
            </button>
          </div>

          {/* Kartu Berkas Terpilih (Sesuai Figma) */}
          {selectedFileName && (
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/80 flex items-center justify-between animate-in fade-in">
              <div className="min-w-0">
                <h4 className="font-mono text-xs font-bold text-gray-900 truncate">
                  {selectedFileName}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Berkas dipilih • Siap dimuat
                </p>
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex-shrink-0 cursor-pointer"
              >
                Buka
              </button>
            </div>
          )}

          {/* Info Card Sesuai Figma */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
            <span className="text-sm leading-none mt-0.5">ℹ️</span>
            <p className="leading-relaxed text-[11px] text-blue-950/80">
              Nama, JSON proyek, susunan blok, parameter, dan arena harus valid. Proyek lama belum diganti sampai seluruh pemeriksaan berhasil.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            {pendingFile && (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors shadow-blue-500/20 cursor-pointer"
              >
                Buka proyek
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
