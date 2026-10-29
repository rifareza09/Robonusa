/**
 * RoboKreasi — Modal Buka Proyek Lokal
 * Mengacu pada desain Figma: "Workspace • Buka proyek lokal.png"
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
      onFileSelect(file);
      onClose();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Buka proyek lokal</h2>
            <p className="text-xs text-gray-500 mt-1">
              Lanjutkan petualangan robotmu dari berkas di komputer.
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

        <div className="p-6 pt-2 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".json,application/json"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-3">
              📂
            </div>
            <p className="text-sm font-bold text-gray-800">
              Tarik berkas proyek ke sini
            </p>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">
              atau pilih melalui folder komputermu
            </p>
            <button
              type="button"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Pilih berkas
            </button>
          </div>

          {/* Info Card Format */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 text-left">
            <p className="text-xs font-bold text-gray-700">Format: .robonusa.json atau .json</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Berkas berisi nama proyek, susunan blok, parameter, dan arena. Berkas asli tidak diubah saat dibuka.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

