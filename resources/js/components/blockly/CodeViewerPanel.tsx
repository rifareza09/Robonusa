/**
 * RoboKreasi — Panel Kode Teks
 * Mengacu pada desain Figma: "Workspace • Kode teks terbuka.png"
 */

import React, { useState } from 'react';

interface CodeViewerPanelProps {
  code: string;
  onClose: () => void;
}

export const CodeViewerPanel: React.FC<CodeViewerPanelProps> = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Bersihkan format kode agar mudah dibaca oleh siswa SD/SMP
  const readableCode = code
    .replace(/"use strict";\n/g, '')
    .replace(/\/\/ === RoboKreasi Program Code ===\n/g, '')
    .replace(/\/\/ Dihasilkan otomatis — jangan edit manual\n/g, '')
    .replace(/try {\n/g, '')
    .replace(/} catch \(e\) {[\s\S]*}/g, '')
    .trim();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-left animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-base text-gray-900">Kode teks</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Padanan program blok • JavaScript / Pseudocode
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Tutup ✕
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Tombol Salin */}
        <div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>Salin kode</span>
          </button>
        </div>

        {/* Kotak Kode */}
        <div className="flex-1 bg-gray-50/80 rounded-xl p-4 border border-gray-200/80 overflow-y-auto font-mono text-xs leading-relaxed text-gray-800">
          <pre className="whitespace-pre-wrap">{readableCode || '// Workspace kosong'}</pre>
        </div>

        {/* Keterangan */}
        <p className="text-xs text-gray-500">
          Setiap blok yang kamu susun di kanvas otomatis diterjemahkan menjadi kode JavaScript terstruktur.
        </p>

        {/* Feedback Salin */}
        {copied && (
          <div className="px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span>✔</span>
            <span>Tersalin! Kode siap ditempel.</span>
          </div>
        )}
      </div>
    </div>
  );
};

