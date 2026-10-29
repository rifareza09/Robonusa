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

// ─── Kategori Kustom RoboKreasi Sesuai Figma ────────────────────────────────

class RoboToolboxCategory extends Blockly.ToolboxCategory {
  /** Hilangkan border-left default Blockly */
  protected override addColourBorder_(_colour: string): void {
    // Suppress inline borderLeft
  }

  /** Hilangkan backgroundColor inline saat dipilih agar CSS pill styling aktif */
  public override setSelected(isSelected: boolean): void {
    super.setSelected(isSelected);
    if (this.rowDiv_) {
      this.rowDiv_.style.backgroundColor = '';
    }
  }

  /** Buat icon squircle kustom */
  protected override createIconDom_(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'category-icon-squircle';
    container.style.backgroundColor = this.colour_ || '#2563EB';

    const id = (this.getId?.() || '').toLowerCase();
    const name = (this.getName?.() || '').toLowerCase();

    let iconSvg = '';
    if (id.includes('gerakan') || name.includes('gerak')) {
      // ↗ Panah diagonal atas-kanan
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
    } else if (id.includes('kontrol') || name.includes('kontrol')) {
      // 🔁 Perulangan / loop
      iconSvg = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>';
    } else if (id.includes('sensor') || name.includes('sensor')) {
      // 🎯 Radar / target konsentris
      iconSvg = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>';
    } else if (id.includes('operator') || name.includes('logika') || name.includes('operator')) {
      // ⑂ Percabangan logika
      iconSvg = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>';
    } else if (id.includes('variabel') || name.includes('variabel')) {
      // (x) Simbol variabel
      iconSvg = '<span style="font-size: 12px; font-weight: 800; font-family: monospace; color: white;">(x)</span>';
    } else if (id.includes('kejadian') || name.includes('kejadian')) {
      // ⚡ Kilat / event
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
    } else if (id.includes('tampilan') || name.includes('tampilan')) {
      // 💬 Gelembung pesan
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    } else if (id.includes('suara') || name.includes('suara')) {
      // 🔔 Lonceng suara
      iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
    } else {
      iconSvg = '<span style="font-size: 13px; color: white;">★</span>';
    }

    container.innerHTML = iconSvg;
    return container;
  }

  /** Buat label kustom: tampilkan "Logika" untuk "Logika (Operator)" */
  protected override createLabelDom_(name: string): HTMLElement {
    const span = document.createElement('span');
    span.className = 'blocklyToolboxCategoryLabel';
    const displayLabel = name.startsWith('Logika') ? 'Logika' : name;
    span.textContent = displayLabel;
    return span;
  }
}

// Daftarkan kategori kustom ke registry Blockly
try {
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    RoboToolboxCategory,
    true
  );
} catch {
  // Safe jika sudah terdaftar
}

// ─── Tema Kustom RoboKreasi Sesuai Figma ────────────────────────────────────

const RoboKreasiTheme = Blockly.Theme.defineTheme('robokreasi_figma', {
  name: 'robokreasi_figma',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#F8FAFC',
    toolboxBackgroundColour: '#F8FAFC',
    toolboxForegroundColour: '#1E293B',
    flyoutBackgroundColour: '#FFFFFF',
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

