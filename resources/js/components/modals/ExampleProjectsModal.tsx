/**
 * RoboKreasi — Modal Contoh Proyek
 * Mengacu pada desain Figma: "Contoh Proyek • Lima latihan.png" & "Workspace • Contoh Proyek.png"
 */

import React, { useState } from 'react';
import type { ExampleProject } from '../../types/robokreasi';

interface ExampleProjectsModalProps {
  isOpen: boolean;
  projects: ExampleProject[];
  onClose: () => void;
  onSelectProject: (project: ExampleProject) => void;
}

export const ExampleProjectsModal: React.FC<ExampleProjectsModalProps> = ({
  isOpen,
  projects,
  onClose,
  onSelectProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<ExampleProject | null>(
    projects.length > 0 ? projects[0] : null
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedProject) {
      onSelectProject(selectedProject);
      onClose();
    }
  };

  // Helper mapping tag topik latihan sesuai Figma
  const getTopicTag = (project: ExampleProject): string => {
    if (project.slug.includes('jalur')) return 'Percabangan';
    if (project.slug.includes('rintangan')) return 'Kontrol & sensor';
    if (project.slug.includes('garis')) return 'Sensor garis';
    if (project.slug.includes('hitung')) return 'Variabel & kontrol';
    if (project.slug.includes('pola')) return 'Gerak & perulangan';
    return 'Latihan robotika';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        {/* Header Modal Sesuai Figma */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Contoh Proyek
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Pilih satu latihan. Pelajari tujuannya, lalu susun dan ubah blok di ruang pemrograman.
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

        {/* Grid Kartu Proyek Sesuai Figma */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50/50">
          {projects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            const topic = getTopicTag(project);

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`flex flex-col justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20'
                    : 'border-gray-200/90 hover:border-blue-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/80">
                      {topic}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-gray-950 leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Latihan robotika • {project.difficulty ? (project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)) : 'Pemula'}
                  </span>
                  {isSelected ? (
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      ✓ Contoh dipilih
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-blue-600 hover:underline">
                      Pilih contoh
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Callout Sesuai Figma */}
        <div className="px-6 py-3 bg-amber-50/80 border-t border-b border-amber-200/60 flex items-center gap-2.5 text-xs text-amber-900">
          <span className="text-sm">ⓘ</span>
          <span>
            Contoh akan mengganti isi kanvas. Jika ada perubahan yang belum disimpan, konfirmasi diperlukan sebelum mengganti contoh.
          </span>
        </div>

        {/* Footer Modal Sesuai Figma */}
        <div className="p-4 px-6 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedProject}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-colors shadow-blue-500/20 cursor-pointer"
          >
            Gunakan contoh
          </button>
        </div>
      </div>
    </div>
  );
};
