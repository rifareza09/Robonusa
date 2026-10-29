/**
 * RoboKreasi — Panel Proyek Contoh
 * Menampilkan daftar proyek contoh dari backend dan memungkinkan pemuatan.
 */

import React from 'react';
import type { ExampleProject } from '../../types/robokreasi';

interface ExampleProjectsPanelProps {
  projects: ExampleProject[];
  onLoadProject: (project: ExampleProject) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  mudah: { label: 'Mudah', color: 'bg-green-100 text-green-700', icon: '⭐' },
  pemula: { label: 'Pemula', color: 'bg-green-100 text-green-700', icon: '⭐' },
  beginner: { label: 'Pemula', color: 'bg-green-100 text-green-700', icon: '⭐' },
  sedang: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-700', icon: '⭐⭐' },
  menengah: { label: 'Menengah', color: 'bg-yellow-100 text-yellow-700', icon: '⭐⭐' },
  intermediate: { label: 'Menengah', color: 'bg-yellow-100 text-yellow-700', icon: '⭐⭐' },
  sulit: { label: 'Sulit', color: 'bg-red-100 text-red-700', icon: '⭐⭐⭐' },
  mahir: { label: 'Mahir', color: 'bg-red-100 text-red-700', icon: '⭐⭐⭐' },
  advanced: { label: 'Mahir', color: 'bg-red-100 text-red-700', icon: '⭐⭐⭐' },
};

export const ExampleProjectsPanel: React.FC<ExampleProjectsPanelProps> = ({
  projects,
  onLoadProject,
  isCollapsed = false,
  onToggle,
}) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
      >
        <span className="font-bold text-sm">📚 Proyek Contoh</span>
        <span className="text-xs opacity-75">
          {isCollapsed ? '▼ Tampilkan' : '▲ Sembunyikan'}
        </span>
      </button>

      {/* List proyek */}
      {!isCollapsed && (
        <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {projects.map((project) => {
            const difficulty = DIFFICULTY_CONFIG[project.difficulty] ?? DIFFICULTY_CONFIG.mudah;
            return (
              <div
                key={project.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                {/* Thumbnail */}
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {project.name}
                    </p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${difficulty.color}`}
                    >
                      {difficulty.icon} {difficulty.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {project.description}
                  </p>
                  <button
                    onClick={() => onLoadProject(project)}
                    className="mt-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    ➕ Buka Proyek Ini
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExampleProjectsPanel;

