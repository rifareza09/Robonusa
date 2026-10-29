/**
 * RoboKreasi — Hook useBlocklyWorkspace
 * Mengelola workspace Blockly: inisialisasi, serialisasi, undo/redo.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import * as idLocale from 'blockly/msg/id';
import { BlocklyWorkspaceData } from '../types/robokreasi';
import { buildToolboxConfig } from '../components/blockly/toolboxConfig';
import { generateProgramCode } from '../components/blockly/generators';

// Set bahasa Indonesia untuk semua pesan Blockly
Blockly.setLocale(idLocale as unknown as Record<string, string>);

// Import definisi blok (side-effect: mendaftarkan semua blok ke Blockly)
import '../components/blockly/blockDefinitions';

// ─── Tema Kustom RoboKreasi Sesuai Figma ────────────────────────────────────

const RoboKreasiTheme = Blockly.Theme.defineTheme('robokreasi_figma', {
  name: 'robokreasi_figma',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#F8FAFC',
    toolboxBackgroundColour: '#FFFFFF',
    toolboxForegroundColour: '#1E293B',
    flyoutBackgroundColour: '#F8FAFC',
    flyoutForegroundColour: '#1E293B',
    flyoutOpacity: 1,
    scrollbarColour: '#CBD5E1',
    scrollbarOpacity: 0.7,
    insertionMarkerColour: '#2563EB',
    insertionMarkerOpacity: 0.4,
    markerColour: '#2563EB',
    cursorColour: '#2563EB',
  },
  fontStyle: {
    family: '"Instrument Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
    weight: 'bold',
    size: 12,
  },
});

// ─── Opsi Workspace ───────────────────────────────────────────────────────────

const WORKSPACE_OPTIONS: Blockly.BlocklyOptions = {
  toolbox: buildToolboxConfig() as Blockly.utils.toolbox.ToolboxDefinition,
  theme: RoboKreasiTheme,
  media: 'https://unpkg.com/blockly/media/',
  scrollbars: true,
  trashcan: true,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.9,
    maxScale: 2,
    minScale: 0.4,
    scaleSpeed: 1.2,
    pinch: true,
  },
  grid: {
    spacing: 20,
    length: 2,
    colour: '#E2E8F0',
    snap: true,
  },
  move: {
    scrollbars: { horizontal: true, vertical: true },
    drag: true,
    wheel: true,
  },
  renderer: 'zelos',  // renderer modern yang tampak bagus untuk anak-anak
  sounds: false,      // matikan suara bawaan Blockly
};

// ─── Return Type ──────────────────────────────────────────────────────────────

export interface UseBlocklyWorkspaceReturn {
  workspaceRef: React.RefObject<HTMLDivElement | null>;
  workspace: Blockly.WorkspaceSvg | null;
  blockCount: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  getCode: () => { code: string; topBlocks: string[]; allBlockTypes: string[] } | null;
  saveWorkspace: () => BlocklyWorkspaceData | null;
  loadWorkspace: (data: BlocklyWorkspaceData) => boolean;
  clearWorkspace: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBlocklyWorkspace(): UseBlocklyWorkspaceReturn {
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const workspaceInstanceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [blockCount, setBlockCount] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Inisialisasi workspace
  useEffect(() => {
    if (!workspaceRef.current) return;

    // Bersihkan instance lama jika ada (mencegah duplikasi di React StrictMode)
    if (workspaceInstanceRef.current) {
      workspaceInstanceRef.current.dispose();
      workspaceInstanceRef.current = null;
    }
    workspaceRef.current.innerHTML = '';

    const workspace = Blockly.inject(workspaceRef.current, WORKSPACE_OPTIONS);
    workspaceInstanceRef.current = workspace;

    // Pasang blok awal "Saat Mulai Diklik" menggunakan JSON serialization
    try {
      Blockly.serialization.workspaces.load(
        {
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                type: 'event_start',
                id: 'start_block',
                x: 30,
                y: 30,
              },
            ],
          },
        },
        workspace
      );
    } catch (err) {
      console.warn('[RoboKreasi] Info load blok awal:', err);
    }

    // Dengarkan perubahan untuk update undo/redo state dan jumlah blok
    workspace.addChangeListener(() => {
      setCanUndo(workspace.getUndoStack().length > 0);
      setCanRedo(workspace.getRedoStack().length > 0);
      setBlockCount(workspace.getAllBlocks(false).length);
    });

    // Amati perubahan ukuran kontainer (misal: saat sidebar ditutup/dibuka)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && workspaceRef.current) {
      resizeObserver = new ResizeObserver(() => {
        Blockly.svgResize(workspace);
      });
      resizeObserver.observe(workspaceRef.current);
    }

    const handleWindowResize = () => {
      Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', handleWindowResize);

    // Cleanup saat unmount
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
      workspace.dispose();
      workspaceInstanceRef.current = null;
    };
  }, []);

  const undo = useCallback(() => {
    workspaceInstanceRef.current?.undo(false);
  }, []);

  const redo = useCallback(() => {
    workspaceInstanceRef.current?.undo(true);
  }, []);

  const getCode = useCallback(() => {
    const workspace = workspaceInstanceRef.current;
    if (!workspace) return null;

    try {
      const res = generateProgramCode(workspace);
      const allBlockTypes = workspace.getAllBlocks(false).map((b) => b.type);
      return {
        code: res.code,
        topBlocks: res.topBlocks,
        allBlockTypes,
      };
    } catch (err) {
      console.error('[RoboKreasi] Gagal generate kode:', err);
      return null;
    }
  }, []);

  const saveWorkspace = useCallback((): BlocklyWorkspaceData | null => {
    const workspace = workspaceInstanceRef.current;
    if (!workspace) return null;
    return Blockly.serialization.workspaces.save(workspace) as BlocklyWorkspaceData;
  }, []);

  const loadWorkspace = useCallback((data: BlocklyWorkspaceData): boolean => {
    const workspace = workspaceInstanceRef.current;
    if (!workspace) return false;
    try {
      Blockly.serialization.workspaces.load(data, workspace);
      return true;
    } catch (err) {
      console.error('[RoboKreasi] Gagal memuat workspace:', err);
      return false;
    }
  }, []);

  const clearWorkspace = useCallback(() => {
    workspaceInstanceRef.current?.clear();
  }, []);

  return {
    workspaceRef,
    workspace: workspaceInstanceRef.current,
    blockCount,
    canUndo,
    canRedo,
    undo,
    redo,
    getCode,
    saveWorkspace,
    loadWorkspace,
    clearWorkspace,
  };
}

