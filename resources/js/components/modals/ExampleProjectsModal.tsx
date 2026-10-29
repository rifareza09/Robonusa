/**
 * RoboKreasi — Modal Contoh Proyek
 * Mengacu pada desain Figma: "Workspace • Contoh Proyek.png"
 */

import React, { useState } from 'react';
import type { ExampleProject } from '../../types/robokreasi';

interface ExampleProjectsModalProps {
  isOpen: boolean;
  projects: ExampleProject[];
  onClose: () => void;
  onSelectProject: (project: ExampleProject) => void;
}

type CategoryFilter = 'semua' | 'gerakan' | 'kontrol';

export const ExampleProjectsModal: React.FC<ExampleProjectsModalProps> = ({
  isOpen,
  projects,
  onClose,
  onSelectProject,
}) => {
  const [filter, setFilter] = useState<CategoryFilter>('semua');
  const [selectedProject, setSelectedProject] = useState<ExampleProject | null>(
    projects.length > 0 ? projects[0] : null
  );

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) => {
    if (filter === 'gerakan') {
      return p.slug.includes('jalur') || p.slug.includes('langkah') || p.difficulty === 'mudah';
    }
    if (filter === 'kontrol') {
      return p.slug.includes('rintangan') || p.slug.includes('hitung') || p.difficulty === 'sedang';
    }
    return true;
  });

  const handleConfirm = () => {
    if (selectedProject) {
      onSelectProject(selectedProject);
      onClose();
    }
  };

  const countBlocks = (project: ExampleProject): number => {
    const blocks = project.workspace_json?.blocks?.blocks;
    if (!Array.isArray(blocks)) return 5;
    return blocks.length;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-6 pb-3 flex items-start justify-between border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Contoh Proyek</h2>
            <p className="text-xs text-gray-500 mt-1">
              Mulai dari contoh, lalu bereksperimen dengan blokmu sendiri.
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

        {/* Filter Pills */}
        <div className="px-6 py-3 flex items-center gap-2 border-b border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setFilter('semua')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === 'semua'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Semua contoh
          </button>
          <button
            type="button"
            onClick={() => setFilter('gerakan')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === 'gerakan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Gerakan dasar
          </button>
          <button
            type="button"
            onClick={() => setFilter('kontrol')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === 'kontrol'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Kontrol & sensor
          </button>
        </div>

        {/* Grid Kartu Proyek */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            const blockCount = countBlocks(project);

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`flex flex-col justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🤖</span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {blockCount} blok
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100/80 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    Simulasi virtual • {project.difficulty}
                  </span>
                  {isSelected && (
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      ✓ Dipilih
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Callout */}
        <div className="px-6 py-2.5 bg-amber-50/80 border-t border-b border-amber-200/60 flex items-center gap-2 text-xs text-amber-800">
          <span>ℹ️</span>
          <span>
            Contoh akan mengganti isi kanvas. Unduh proyek saat ini terlebih dahulu jika ingin menyimpannya.
          </span>
        </div>

        {/* Footer Modal */}
        <div className="p-4 px-6 flex items-center justify-end gap-2 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedProject}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-colors shadow-blue-500/20"
          >
            <span>➔</span>
            <span>Gunakan contoh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
