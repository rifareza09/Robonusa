/**
 * RoboKreasi — Modal Konfirmasi Perubahan Belum Disimpan
 * Mengacu pada desain Figma:
 * - "Konfirmasi membuka proyek lain.png"
 * - "Konfirmasi meninggalkan ruang kerja.png"
 */

import React from 'react';

export type UnsavedModalMode = 'open' | 'leave';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  mode?: UnsavedModalMode;
  projectName: string;
  onSaveAndProceed: () => void;
  onProceedWithoutSaving: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  mode = 'open',
  projectName,
  onSaveAndProceed,
  onProceedWithoutSaving,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isLeave = mode === 'leave';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150 text-left">
        <div className="p-6">
          {/* Header Icon & Judul Sesuai Figma */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 text-xl shadow-xs">
              {isLeave ? (
                <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <h3 className="text-xl font-black text-gray-950 tracking-tight mb-1">
            {isLeave ? 'Simpan sebelum keluar?' : 'Simpan sebelum membuka?'}
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            {isLeave ? 'Kamu akan kembali ke Beranda.' : 'Ada perubahan yang belum disimpan.'}
          </p>

          {/* Kartu Status Proyek Sesuai Figma */}
          <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/80 mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-gray-900 truncate">{projectName}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Perubahan belum disimpan ke komputer</p>
            </div>
          </div>

          {/* Callout Peringatan Kuning/Amber Sesuai Figma */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl mb-6 text-xs text-amber-950">
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <div className="leading-relaxed">
                <span className="font-bold block text-amber-900 mb-0.5">
                  {isLeave ? 'Jangan sampai kreasimu tertinggal' : 'Simpan kreasimu terlebih dahulu'}
                </span>
                <span>
                  {isLeave
                    ? 'Jika kamu keluar tanpa menyimpan, perubahan terbaru pada proyek ini akan hilang.'
                    : 'Jika kamu membuka proyek lain tanpa menyimpan, perubahan terbaru pada proyek ini akan hilang.'}
                </span>
              </div>
            </div>
          </div>

          {/* Opsi Aksi 3 Tombol Sesuai Figma */}
          <div className="flex flex-col gap-2">
            {/* Opsi 1: Simpan lalu lanjut */}
            <button
              type="button"
              onClick={onSaveAndProceed}
              className="w-full py-3 px-4 bg-[#0D7D7D] hover:bg-[#0B6868] active:bg-[#095454] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>{isLeave ? 'Simpan, lalu ke Beranda' : 'Simpan, lalu buka proyek lain'}</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center -mt-0.5 mb-2">
              {isLeave
                ? 'Unduh file proyek ini sebelum meninggalkan ruang kerja.'
                : 'Unduh file proyek ini, lalu pilih proyek yang ingin dibuka.'}
            </p>

            {/* Opsi 2: Lanjut tanpa menyimpan */}
            <button
              type="button"
              onClick={onProceedWithoutSaving}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition-colors shadow-2xs cursor-pointer"
            >
              {isLeave ? 'Keluar tanpa menyimpan' : 'Buka tanpa menyimpan'}
            </button>
            <p className="text-[10px] text-gray-400 text-center -mt-0.5 mb-2">
              {isLeave
                ? 'Abaikan perubahan terbaru dan kembali ke Beranda.'
                : 'Abaikan perubahan terbaru dan lanjutkan memilih file.'}
            </p>

            {/* Opsi 3: Batal */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-600 font-semibold text-xs rounded-xl border border-gray-200 transition-colors cursor-pointer"
            >
              {isLeave ? 'Batal, tetap di sini' : 'Batal, lanjutkan mengedit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
