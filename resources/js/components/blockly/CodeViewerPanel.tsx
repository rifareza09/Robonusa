/**
 * RoboKreasi — Panel Kode Teks
 * Mengacu pada desain Figma: "Workspace • Kode teks terbuka.png"
 */

import React, { useState } from 'react';

interface CodeViewerPanelProps {
  code: string;
  onClose: () => void;
}

/**
 * Menerjemahkan kode JavaScript internal Blockly menjadi
 * format Pseudocode berbahasa Indonesia yang ramah siswa sesuai Figma.
 */
function translateToIndonesianPseudocode(jsCode: string): string {
  if (!jsCode || !jsCode.trim()) {
    return '// Workspace kosong. Belum ada blok program.';
  }

  const lines = jsCode.split('\n');
  const output: string[] = ['ketika_jalankan():'];

  let indent = '  ';

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('"use strict"') || line.startsWith('try {') || line.startsWith('} catch')) {
      continue;
    }

    if (line.includes('while (true)') || line.includes('while(true)')) {
      output.push(`${indent}selamanya:`);
      indent += '  ';
    } else if (line.match(/for\s*\([^;]+;\s*[^;]+<\s*(\d+);/)) {
      const match = line.match(/for\s*\([^;]+;\s*[^;]+<\s*(\d+);/);
      output.push(`${indent}ulangi ${match ? match[1] : ''} kali:`);
      indent += '  ';
    } else if (line.includes('if (robot.isObstacleAhead())')) {
      output.push(`${indent}jika jarak_depan_cm() < 30:`);
      indent += '  ';
    } else if (line.includes('if (robot.isLineDetected())')) {
      output.push(`${indent}jika di_atas_garis():`);
      indent += '  ';
    } else if (line.includes('} else {')) {
      const parentIndent = indent.length >= 2 ? indent.slice(2) : '';
      output.push(`${parentIndent}jika_tidak:`);
    } else if (line === '}') {
      if (indent.length > 2) {
        indent = indent.slice(2);
      }
    } else if (line.includes('await robot.moveForward(')) {
      const match = line.match(/moveForward\((\d+)\)/);
      const val = match ? Number(match[1]) * 10 : 10;
      output.push(`${indent}maju_cm(${val})`);
    } else if (line.includes('await robot.moveBackward(')) {
      const match = line.match(/moveBackward\((\d+)\)/);
      const val = match ? Number(match[1]) * 10 : 10;
      output.push(`${indent}mundur_cm(${val})`);
    } else if (line.includes('await robot.turnRight(')) {
      output.push(`${indent}putar_kanan(90)`);
    } else if (line.includes('await robot.turnLeft(')) {
      output.push(`${indent}putar_kiri(90)`);
    } else if (line.includes('await robot.stop()')) {
      output.push(`${indent}berhenti()`);
    } else if (line.includes('robot.setSpeed(')) {
      const match = line.match(/setSpeed\((\d+)\)/);
      output.push(`${indent}atur_kecepatan(${match ? match[1] : 5})`);
    } else if (line.includes('await robot.speak(')) {
      const match = line.match(/speak\(["']([^"']+)["']\)/);
      output.push(`${indent}tampilkan_pesan("${match ? match[1] : ''}")`);
    } else if (line.includes('await robot.beep()')) {
      output.push(`${indent}bunyikan_nada()`);
    } else if (line.includes('await robot.wait(')) {
      const match = line.match(/wait\((\d+)\)/);
      output.push(`${indent}tunggu(${match ? match[1] : 1})`);
    }
  }

  output.push(`${indent}berhenti()`);
  return output.join('\n');
}

export const CodeViewerPanel: React.FC<CodeViewerPanelProps> = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const pseudocode = translateToIndonesianPseudocode(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pseudocode);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = pseudocode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        setCopyError(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden text-left animate-in fade-in duration-200">
      {/* Header Sesuai Figma */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-extrabold text-base text-gray-900 tracking-tight">Kode teks</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Padanan program blok • Pseudocode
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Tutup ✕
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3.5 overflow-hidden">
        {/* Tombol Salin Sesuai Figma */}
        <div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Salin kode</span>
          </button>
        </div>

        {/* Kotak Kode Pseudocode Sesuai Figma */}
        <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-4 border border-gray-200/80 overflow-y-auto font-mono text-xs leading-relaxed text-gray-800 shadow-2xs">
          <pre className="whitespace-pre font-mono">{pseudocode}</pre>
        </div>

        {/* Keterangan Padanan Sesuai Figma */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Sama dengan blok: instruksi dieksekusi secara berurutan sesuai alur perulangan dan kondisi sensor robot.
        </p>

        {/* Feedback Salin Sukses Sesuai Figma */}
        {copied && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Tersalin! Kode siap ditempel.</span>
          </div>
        )}

        {/* Feedback Error Fallback Sesuai Figma */}
        {copyError && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex flex-col gap-1 animate-in fade-in">
            <p>Belum bisa menyalin. Coba lagi, ya.</p>
            <div className="text-[11px] text-rose-600">
              <button type="button" onClick={handleCopy} className="underline font-bold">Coba lagi</button> • Pilih teks secara manual
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
