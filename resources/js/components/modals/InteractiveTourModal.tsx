/**
 * RoboKreasi — Modal Tur Panduan Interaktif 3 Langkah
 * Mengacu pada desain Figma:
 * - "Tur • Langkah 1 dari 3.png"
 * - "Tur • Langkah 2 dari 3.png"
 * - "Tur • Langkah 3 dari 3.png"
 */

import React, { useState } from 'react';

interface InteractiveTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      badge: 'Langkah 1 dari 3',
      title: 'Pilih, tarik, sambungkan.',
      description:
        'Ambil blok dari palet di kiri, lalu sambungkan di kanvas dari atas ke bawah. Pilih angka pada blok untuk mengubah nilainya.',
      tip: '🧩 Oranye: gerakan • Ungu: kontrol • Cyan: sensor',
      target: 'pustaka-blok',
    },
    {
      step: 2,
      badge: 'Langkah 2 dari 3',
      title: 'Jalankan dan amati robot.',
      description:
        'Pilih Jalankan. Cocokkan blok berlabel Aktif dengan gerakan robot. Garis utuh adalah jejak eksekusi; garis putus-putus hanya ilustrasi.',
      tip: '▷ Hentikan menghentikan eksekusi. Reset mengembalikan robot ke titik awal.',
      target: 'simulator-robot',
    },
    {
      step: 3,
      badge: 'Langkah 3 dari 3',
      title: 'Simpan hasil belajarmu.',
      description:
        'Pilih Simpan proyek, beri nama, lalu Unduh file. Proyek disimpan sebagai berkas JSON di komputer, bukan otomatis di cloud.',
      tip: '📥 Perubahan tetap berstatus belum diunduh sampai tindakan unduh dilakukan.',
      target: 'toolbar-simpan',
    },
  ];

  const current = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Kartu Dialog Tur Sesuai Figma */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Header: Progress Stepper */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-3">
            <span className="text-blue-600 font-extrabold tracking-wide uppercase">
              {current.badge}
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Lewati
            </button>
          </div>

          {/* Stepper Bar 3 Segmen Sesuai Figma */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Isi Panduan */}
        <div className="p-6 pt-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
            {current.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {current.description}
          </p>

          {/* Tip Box Sesuai Figma */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs font-semibold text-blue-900 mb-6 flex items-start gap-2.5">
            <span>💡</span>
            <span className="leading-snug">{current.tip}</span>
          </div>

          {/* Navigasi Footer Sesuai Figma */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Kembali</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-gray-400">
                Kenali ruang kerjamu
              </span>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
            >
              <span>{currentStep === 3 ? '✓ Selesai' : 'Lanjut'}</span>
              {currentStep < 3 && <span>→</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
