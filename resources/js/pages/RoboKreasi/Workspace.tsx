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
  const [generatedCode, setGeneratedCode] = useState<string>('');

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

      {/* Layout Utama Full Screen */}
      <div className="flex flex-col h-screen bg-[#F8FAFC] text-gray-800 overflow-hidden font-sans">
        {/* Header & Subheader Navigasi (Sesuai Figma) */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200/80 px-6 py-2 shadow-xs">
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
            onImport={() => setIsOpenModalOpen(true)}
            onProjectNameChange={setProjectName}
            onOpenGuide={guides.length > 0 ? () => setIsGuideOpen(true) : undefined}
            onOpenExamplesModal={exampleProjects.length > 0 ? () => setIsExamplesModalOpen(true) : undefined}
            isSavedLocally={isSavedLocally}
          />
        </header>

        {/* Area Konten Utama (Editor Tengah & Simulator/Kode Kanan) */}
        <main className="flex flex-1 overflow-hidden gap-3 p-3">
          {/* Kolom Tengah: Editor Blok Blockly */}
          <div
            id="block-category-panel"
            className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200/90 flex flex-col"
          >
            {/* Header Editor Sesuai Figma Kit Desain */}
            <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <span>🧩</span>
                  <span>Programku</span>
                </h2>
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                  {blockCount} blok
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Tombol Urungkan & Ulangi Cepat di Editor */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={!canUndo}
                    className="px-2.5 py-1 bg-white hover:bg-gray-50 disabled:opacity-35 disabled:cursor-not-allowed border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                    title="Urungkan aksi (Ctrl+Z)"
                  >
                    ↩ Urungkan
                  </button>
                  <button
                    type="button"
                    onClick={redo}
                    disabled={!canRedo}
                    className="px-2.5 py-1 bg-white hover:bg-gray-50 disabled:opacity-35 disabled:cursor-not-allowed border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                    title="Ulangi aksi (Ctrl+Y)"
                  >
                    ↪ Ulangi
                  </button>
                </div>

                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                {/* Tombol Toggle Kode Teks Sesuai Figma */}
                <button
                  type="button"
                  onClick={handleToggleCodeViewer}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors shadow-2xs ${
                    isCodeViewerOpen
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                  title={isCodeViewerOpen ? 'Kembali ke Simulasi Robot' : 'Buka padanan kode JavaScript/teks'}
                >
                  <span>{isCodeViewerOpen ? '🤖' : '💻'}</span>
                  <span>{isCodeViewerOpen ? 'Simulasi' : 'Kode teks'}</span>
                </button>

                <span className="hidden xl:inline text-gray-400 text-[11px] pl-2 border-l border-gray-200">
                  Ctrl+Z: Batal | Ctrl+Y: Ulangi | Scroll: Zoom
                </span>
              </div>
            </div>

            {/* Target Injeksi Blockly */}
            <div
              id="blockly-workspace"
              ref={workspaceRef}
              className="flex-1 w-full"
            />
          </div>

          {/* Kolom Kanan: Simulator Robot ATAU Panel Kode Teks */}
          <div className="w-80 lg:w-[360px] flex-shrink-0 flex flex-col gap-2 overflow-hidden">
            {isCodeViewerOpen ? (
              <CodeViewerPanel
                code={generatedCode}
                onClose={() => setIsCodeViewerOpen(false)}
              />
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto">
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
                  />
                </div>

                {/* Panduan Cepat untuk Siswa */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-xs text-blue-900 shadow-2xs flex-shrink-0">
                  <p className="font-bold mb-1 flex items-center gap-1.5 text-blue-800">
                    <span>💡</span>
                    <span>Cara belajar:</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-blue-950/80">
                    <li>Pilih blok di panel sebelah kiri</li>
                    <li>Susun dan hubungkan di kanvas tengah</li>
                    <li>Klik <strong>▶ Jalankan</strong> untuk menguji robot</li>
                    <li>Lihat respon sensor dan pergerakan virtual! 🤖</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer Bar Sesuai Figma Kit Desain */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-1.5 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>💾</span>
            <span>Simpan ke komputer • Tidak disimpan otomatis</span>
          </div>
          <div className="flex items-center gap-3">
            <span>🇮🇩 Bahasa Indonesia</span>
            <span>•</span>
            <span>☀️ Mode terang</span>
          </div>
        </footer>
      </div>

      {/* ─── Modal Dialogs (Sesuai Figma) ─────────────────────────────────── */}

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
