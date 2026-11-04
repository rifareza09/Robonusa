/**
 * RoboKreasi — Halaman Workspace Utama
 * Mengacu pada Desain Sistem Figma:
 * - "Ruang pemrograman • Desktop terang.png"
 * - "Kit desain • RoboNusa.png"
 * - "Workspace • Contoh Proyek.png"
 * - "Workspace • Simpan proyek.png"
 * - "Workspace • Buka proyek lokal.png"
 * - "Workspace • Kode teks terbuka.png"
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';

import { useBlocklyWorkspace } from '../../hooks/useBlocklyWorkspace';
import { useSimulator } from '../../hooks/useSimulator';
import { SimulatorCanvas } from '../../components/simulator/SimulatorCanvas';
import { ProgramToolbar } from '../../components/blockly/ProgramToolbar';
import { CodeViewerPanel } from '../../components/blockly/CodeViewerPanel';
import { SaveProjectModal } from '../../components/modals/SaveProjectModal';
import { OpenProjectModal } from '../../components/modals/OpenProjectModal';
import { ExampleProjectsModal } from '../../components/modals/ExampleProjectsModal';
import { InteractiveTourModal } from '../../components/modals/InteractiveTourModal';
import { UnsavedChangesModal, type UnsavedModalMode } from '../../components/modals/UnsavedChangesModal';

import {
  exportProjectAsJSON,
  importProjectFromSelectedFile,
  loadExampleProject,
} from '../../lib/projectStorage';

import type { WorkspacePageProps, ExampleProject } from '../../types/robokreasi';

// ─── Komponen Halaman ─────────────────────────────────────────────────────────

const Workspace: React.FC<WorkspacePageProps> = ({
  blockCategories: _blockCategories = [],
  blockDefinitions: _blockDefinitions = [],
  exampleProjects = [],
  guides = [],
}) => {
  const [projectName, setProjectName] = useState('Proyek Saya');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  // Modal states sesuai Figma
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [missionTip, setMissionTip] = useState<{ title: string; desc: string } | null>(null);
  const [mobileTab, setMobileTab] = useState<'program' | 'simulator'>('program');

  // Konfirmasi Perubahan Belum Disimpan Sesuai Figma
  const [unsavedConfirmation, setUnsavedConfirmation] = useState<{
    isOpen: boolean;
    mode: UnsavedModalMode;
    pendingAction: (() => void) | null;
  }>({ isOpen: false, mode: 'open', pendingAction: null });

  // Mode Gelap Sesuai Figma ("Ruang pemrograman • Desktop gelap.png")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('robokreasi_theme') === 'dark';
    }
    return false;
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('robokreasi_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  }, []);

  // Blockly workspace
  const {
    workspaceRef,
    workspace,
    blockCount,
    canUndo,
    canRedo,
    undo,
    redo,
    getCode,
  } = useBlocklyWorkspace();

  // Simulator
  const {
    simulatorState,
    programStatus,
    errorMessage,
    arenaMode,
    setArenaMode,
    runProgram,
    stopProgram,
    resetSimulator,
    setCostume,
    setSize,
  } = useSimulator();

  // ─── Notifikasi Toast ──────────────────────────────────────────────────────

  const showNotification = useCallback((message: string) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 4000);
  }, []);

  // ─── Handlers Eksekusi & Simpan ─────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    const result = getCode?.();
    if (!result) {
      showNotification('❌ Tidak dapat membuat program. Workspace mungkin kosong.');
      return;
    }
    await runProgram(result.code, result.topBlocks, result.allBlockTypes);
  }, [getCode, runProgram, showNotification]);

  const handleExport = useCallback((name: string) => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    try {
      exportProjectAsJSON(workspace, name);
      setIsSavedLocally(true);
      showNotification(`✅ Proyek "${name}" berhasil diunduh ke komputer!`);
    } catch {
      showNotification('❌ Gagal menyimpan proyek. Silakan coba lagi.');
    }
  }, [workspace, showNotification]);

  const handleFileImport = useCallback((file: File) => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    importProjectFromSelectedFile(file, workspace, (result) => {
      if (result.success) {
        if (result.projectName) setProjectName(result.projectName);
        setIsSavedLocally(true);
        resetSimulator();
        showNotification(`✅ Proyek "${result.projectName ?? 'Proyek'}" berhasil dibuka!`);
      } else {
        showNotification(result.error ?? '❌ Gagal membuka berkas.');
      }
    });
  }, [workspace, resetSimulator, showNotification]);

  const handleLoadExample = useCallback((project: ExampleProject) => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    const result = loadExampleProject(workspace, project.workspace_json);
    if (result.success) {
      setProjectName(project.name);
      setMissionTip({
        title: project.name,
        desc: project.description,
      });
      setIsSavedLocally(false);
      resetSimulator();

      // Sesuaikan arena latihan sesuai jenis proyek contoh
      if (project.slug === 'menghindari-rintangan-virtual') {
        setArenaMode('obstacles');
      } else if (project.slug === 'robot-pemilih-jalur') {
        setArenaMode('lines');
      } else {
        setArenaMode('empty');
      }

      showNotification(`✅ Proyek contoh "${project.name}" berhasil dimuat!`);
    } else {
      showNotification(result.error ?? '❌ Gagal memuat proyek contoh.');
    }
  }, [workspace, resetSimulator, setArenaMode, showNotification]);

  // Muat proyek contoh secara otomatis jika terdapat parameter query ?example=<slug>
  useEffect(() => {
    if (!workspace || exampleProjects.length === 0) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const exampleSlug = params.get('example');
      if (exampleSlug) {
        const found = exampleProjects.find((p) => p.slug === exampleSlug);
        if (found) {
          handleLoadExample(found);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch {
      // ignore
    }
  }, [workspace, exampleProjects, handleLoadExample]);

  // Konfirmasi sebelum membuka proyek lain / keluar jika ada perubahan yang belum disimpan
  const confirmIfUnsaved = useCallback(
    (action: () => void, mode: UnsavedModalMode = 'open') => {
      if (blockCount > 1 && !isSavedLocally) {
        setUnsavedConfirmation({
          isOpen: true,
          mode,
          pendingAction: action,
        });
      } else {
        action();
      }
    },
    [blockCount, isSavedLocally]
  );

  const handleNavigateHome = useCallback(() => {
    confirmIfUnsaved(() => {
      window.location.href = '/beranda';
    }, 'leave');
  }, [confirmIfUnsaved]);

  // Toggle panel kode teks
  const handleToggleCodeViewer = useCallback(() => {
    if (!isCodeViewerOpen) {
      const res = getCode?.();
      setGeneratedCode(res?.code || '// Belum ada blok program di workspace.');
      setIsCodeViewerOpen(true);
    } else {
      setIsCodeViewerOpen(false);
    }
  }, [isCodeViewerOpen, getCode]);

  // Keyboard shortcuts (Ctrl+Z: Undo, Ctrl+Y: Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Perbarui preview kode teks jika panel kode terbuka dan workspace berubah
  useEffect(() => {
    if (isCodeViewerOpen && workspace) {
      const listener = () => {
        const res = getCode?.();
        if (res?.code) {
          setGeneratedCode(res.code);
        }
      };
      workspace.addChangeListener(listener);
      return () => workspace.removeChangeListener(listener);
    }
  }, [isCodeViewerOpen, workspace, getCode]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head title={`RoboKreasi — ${projectName}`} />

      {/* Notifikasi Toast */}
      {notificationMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white bg-gray-900 border border-gray-700 max-w-md text-center transition-all animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {notificationMessage}
        </div>
      )}

      {/* Layout Utama Full Screen PictoBlox */}
      <div className={`flex flex-col h-screen ${isDarkMode ? 'dark bg-[#0F172A] text-gray-100' : 'bg-[#F0F2F5] text-gray-800'} overflow-hidden font-sans`}>
        {/* Header Navigasi PictoBlox */}
        <header className="flex-shrink-0">
          <ProgramToolbar
            programStatus={programStatus}
            canUndo={canUndo}
            canRedo={canRedo}
            errorMessage={errorMessage}
            projectName={projectName}
            onRun={handleRun}
            onStop={stopProgram}
            onReset={resetSimulator}
            onUndo={undo}
            onRedo={redo}
            onExport={() => setIsSaveModalOpen(true)}
            onImport={() => confirmIfUnsaved(() => setIsOpenModalOpen(true))}
            onProjectNameChange={setProjectName}
            onOpenGuide={() => setIsTourModalOpen(true)}
            onOpenExamplesModal={exampleProjects.length > 0 ? () => confirmIfUnsaved(() => setIsExamplesModalOpen(true)) : undefined}
            onNavigateHome={handleNavigateHome}
            isSavedLocally={isSavedLocally}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        </header>

        {/* Switcher Tab Layar Kecil (Mobile / Tablet) Sesuai Figma */}
        <div className={`lg:hidden flex border-b ${isDarkMode ? 'bg-[#1E293B] border-gray-800' : 'bg-white border-gray-200'}`}>
          <button
            type="button"
            onClick={() => setMobileTab('program')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              mobileTab === 'program'
                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Program</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('simulator')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              mobileTab === 'simulator'
                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>🤖</span>
            <span>Simulasi</span>
          </button>
        </div>

        {/* Area Konten Utama (Editor Tengah & Simulator/Kode Kanan) */}
        <main className="flex flex-1 overflow-hidden gap-3 p-3">
          {/* Kolom Tengah: Editor Blok Blockly */}
          <div
            id="block-category-panel"
            className={`flex-1 min-w-0 ${isDarkMode ? 'bg-[#1E293B] border-gray-800' : 'bg-white border-gray-200/90'} rounded-2xl shadow-sm overflow-hidden border ${
              mobileTab === 'program' ? 'flex' : 'hidden lg:flex'
            } flex-col`}
          >


            {/* Banner Misi/Tantangan Sesuai Figma (jika ada proyek contoh aktif) */}
            {missionTip && (
              <div className="mx-4 mt-2.5 mb-1 p-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between text-xs shadow-2xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                    🎯
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{missionTip.title}</h4>
                    <p className="text-gray-600 text-[11px] mt-0.5 line-clamp-1">{missionTip.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMissionTip(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 text-xs rounded-lg transition-colors cursor-pointer flex-shrink-0 ml-2"
                  title="Sembunyikan panduan misi"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Target Injeksi Blockly dengan Floating Toolbar PictoBlox */}
            <div className="relative flex-1 w-full overflow-hidden">
              <div
                id="blockly-workspace"
                ref={workspaceRef}
                className="w-full h-full"
              />

              {/* Floating Action Controls PictoBlox (Undo, Redo, Zoom) */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-2xl border border-gray-200 shadow-md">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-sm"
                  title="Urungkan (Ctrl+Z)"
                >
                  ↶
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-sm"
                  title="Ulangi (Ctrl+Y)"
                >
                  ↷
                </button>
                <div className="h-px bg-gray-200 mx-1" />
                <button
                  type="button"
                  onClick={() => workspace?.zoomCenter(1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer text-sm font-bold"
                  title="Perbesar (Zoom In)"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => workspace?.zoomCenter(-1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer text-sm font-bold"
                  title="Perkecil (Zoom Out)"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => {
                    workspace?.setScale(0.9);
                    workspace?.scrollCenter();
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer text-sm font-bold"
                  title="Reset Zoom"
                >
                  =
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Simulator Robot ATAU Panel Kode Teks */}
          <div className={`w-full lg:w-[420px] xl:w-[450px] flex-shrink-0 flex-col gap-2 overflow-hidden ${
            mobileTab === 'simulator' ? 'flex' : 'hidden lg:flex'
          }`}>
            {isCodeViewerOpen ? (
              <CodeViewerPanel
                code={generatedCode}
                onClose={() => setIsCodeViewerOpen(false)}
              />
            ) : (
              <>
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <SimulatorCanvas
                    state={simulatorState}
                    programStatus={programStatus}
                    width={500}
                    height={400}
                    arenaMode={arenaMode}
                    onArenaModeChange={setArenaMode}
                    onRun={handleRun}
                    onStop={stopProgram}
                    onReset={resetSimulator}
                    onCostumeChange={setCostume}
                    onSizeChange={setSize}
                    onToggleCodeViewer={handleToggleCodeViewer}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ─── Modal Dialogs (Sesuai Figma) ─────────────────────────────────── */}

      {/* Modal Tur Panduan Interaktif 3 Langkah Sesuai Figma */}
      <InteractiveTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      {/* Modal Konfirmasi Buka Proyek Lain / Keluar (Unsaved Changes) Sesuai Figma */}
      <UnsavedChangesModal
        isOpen={unsavedConfirmation.isOpen}
        mode={unsavedConfirmation.mode}
        projectName={projectName}
        onSaveAndProceed={() => {
          handleExport(projectName);
          const act = unsavedConfirmation.pendingAction;
          setUnsavedConfirmation((prev) => ({ ...prev, isOpen: false, pendingAction: null }));
          act?.();
        }}
        onProceedWithoutSaving={() => {
          const act = unsavedConfirmation.pendingAction;
          setUnsavedConfirmation((prev) => ({ ...prev, isOpen: false, pendingAction: null }));
          act?.();
        }}
        onCancel={() => {
          setUnsavedConfirmation((prev) => ({ ...prev, isOpen: false, pendingAction: null }));
        }}
      />

      {/* Modal Simpan Proyek */}
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        initialProjectName={projectName}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={(name) => {
          setProjectName(name);
          handleExport(name);
        }}
      />

      {/* Modal Buka Proyek */}
      <OpenProjectModal
        isOpen={isOpenModalOpen}
        onClose={() => setIsOpenModalOpen(false)}
        onFileSelect={handleFileImport}
      />

      {/* Modal Contoh Proyek */}
      <ExampleProjectsModal
        isOpen={isExamplesModalOpen}
        projects={exampleProjects}
        onClose={() => setIsExamplesModalOpen(false)}
        onSelectProject={handleLoadExample}
      />

      {/* Modal Panduan Interaktif */}
      {isGuideOpen && guides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{guides[0].title}</h3>
                  <p className="text-xs text-blue-100 mt-0.5">{guides[0].description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition-colors cursor-pointer"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* List Langkah */}
            <div className="p-6 overflow-y-auto divide-y divide-gray-100 flex-1 space-y-4">
              {guides[0].steps.map((step) => (
                <div key={step.id} className="pt-4 first:pt-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {step.step_number}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">{step.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Mengerti, Mulai Belajar! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[RoboKreasi Workspace Error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-4">
            🤖⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan di Workspace</h2>
          <p className="text-sm text-gray-600 max-w-md mb-4 font-mono bg-white p-3 rounded border border-gray-200">
            {this.state.error?.message ?? 'Kesalahan tidak diketahui'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            🔄 Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const WorkspacePage: React.FC<WorkspacePageProps> = (props) => (
  <ErrorBoundary>
    <Workspace {...props} />
  </ErrorBoundary>
);

export default WorkspacePage;
