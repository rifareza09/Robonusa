/**
 * RoboKreasi — Halaman Workspace Utama
 * Menerima props dari Inertia (data backend) dan merender:
 * - Toolbox + Workspace Blockly (kiri & tengah)
 * - Simulator Robot (kanan)
 * - Toolbar kontrol program
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';

import { useBlocklyWorkspace } from '../../hooks/useBlocklyWorkspace';
import { useSimulator } from '../../hooks/useSimulator';
import { SimulatorCanvas } from '../../components/simulator/SimulatorCanvas';
import { ProgramToolbar } from '../../components/blockly/ProgramToolbar';
import { ExampleProjectsPanel } from '../../components/blockly/ExampleProjectsPanel';

import {
  exportProjectAsJSON,
  importProjectFromFile,
  loadExampleProject,
} from '../../lib/projectStorage';

import type { WorkspacePageProps, ExampleProject } from '../../types/robokreasi';

// ─── Komponen Halaman ─────────────────────────────────────────────────────────

const Workspace: React.FC<WorkspacePageProps> = ({
  blockCategories: _blockCategories = [],
  blockDefinitions: _blockDefinitions = [],
  exampleProjects = [],
  guides: _guides = [],
}) => {
  const [projectName, setProjectName] = useState('Proyek Saya');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isExamplesPanelCollapsed, setIsExamplesPanelCollapsed] = useState(false);

  // Blockly workspace
  const {
    workspaceRef,
    workspace,
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
    runProgram,
    stopProgram,
    resetSimulator,
  } = useSimulator();

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    const result = getCode?.();
    if (!result) {
      showNotification('❌ Tidak dapat membuat program. Workspace mungkin kosong.');
      return;
    }
    await runProgram(result.code, result.topBlocks, result.allBlockTypes);
  }, [getCode, runProgram]);

  const handleExport = useCallback((name: string) => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    try {
      exportProjectAsJSON(workspace, name);
      showNotification(`✅ Proyek "${name}" berhasil disimpan!`);
    } catch {
      showNotification('❌ Gagal menyimpan proyek. Coba lagi.');
    }
  }, [workspace]);

  const handleImport = useCallback(() => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    importProjectFromFile(workspace, (result) => {
      if (result.success) {
        if (result.projectName) setProjectName(result.projectName);
        showNotification(`✅ Proyek "${result.projectName}" berhasil dibuka!`);
      } else {
        showNotification(result.error ?? '❌ Gagal membuka file.');
      }
    });
  }, [workspace]);

  const handleLoadExample = useCallback((project: ExampleProject) => {
    if (!workspace) {
      showNotification('❌ Workspace belum siap.');
      return;
    }
    const result = loadExampleProject(workspace, project.workspace_json);
    if (result.success) {
      setProjectName(project.name);
      resetSimulator();
      showNotification(`✅ Proyek contoh "${project.name}" berhasil dimuat!`);
    } else {
      showNotification(result.error ?? '❌ Gagal memuat proyek contoh.');
    }
  }, [workspace, resetSimulator]);

  // Keyboard shortcuts
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

  // ─── Notifikasi ────────────────────────────────────────────────────────────

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 4000);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head title="RoboKreasi — Workspace" />

      {/* Notifikasi Toast */}
      {notificationMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white bg-gray-800 max-w-md text-center"
          style={{ animation: 'fadeInDown 0.3s ease' }}
        >
          {notificationMessage}
        </div>
      )}

      {/* Layout utama */}
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
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
            onExport={handleExport}
            onImport={handleImport}
            onProjectNameChange={setProjectName}
          />
        </header>

        {/* Area konten */}
        <div className="flex flex-1 overflow-hidden gap-2 p-2">
          {/* Panel kiri: Proyek Contoh (opsional) */}
          {exampleProjects.length > 0 && (
            <div className="w-56 flex-shrink-0 flex flex-col gap-2 overflow-y-auto">
              <ExampleProjectsPanel
                projects={exampleProjects}
                onLoadProject={handleLoadExample}
                isCollapsed={isExamplesPanelCollapsed}
                onToggle={() => setIsExamplesPanelCollapsed((v) => !v)}
              />
            </div>
          )}

          {/* Tengah: Blockly Workspace */}
          <div className="flex-1 min-w-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {/* Label */}
            <div className="px-4 py-2 bg-gray-700 text-white text-xs font-semibold flex items-center gap-2">
              <span>🧩</span>
              <span>Editor Blok — Susun blokmu di sini!</span>
              <span className="ml-auto text-gray-400 text-xs">
                Ctrl+Z: Batal | Ctrl+Y: Ulangi | Scroll: Zoom
              </span>
            </div>
            {/* Blockly injection target */}
            <div
              ref={workspaceRef}
              className="w-full"
              style={{ height: 'calc(100% - 36px)' }}
            />
          </div>

          {/* Kanan: Simulator */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-2">
            <SimulatorCanvas
              state={simulatorState}
              programStatus={programStatus}
              width={500}
              height={400}
            />

            {/* Hint untuk anak-anak */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700">
              <p className="font-bold mb-1">💡 Cara bermain:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Ambil blok dari kiri</li>
                <li>Susun di tengah</li>
                <li>Klik <strong>▶ Mulai</strong></li>
                <li>Lihat robot bergerak! 🤖</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
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

