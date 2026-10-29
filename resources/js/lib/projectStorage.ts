/**
 * RoboKreasi — Manajemen Penyimpanan Proyek JSON Lokal
 * - Ekspor workspace ke file JSON
 * - Impor file JSON dengan validasi ketat
 * - Tolak file rusak tanpa merusak workspace aktif
 */

import * as Blockly from 'blockly';
import type {
  LocalProjectFile,
  BlocklyWorkspaceData,
} from '../types/robokreasi';
import {
  PROJECT_FORMAT,
  PROJECT_VERSION,
  BLOCK_TYPES,
} from '../types/robokreasi';

// ─── Konstanta Validasi ───────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

/** Semua jenis blok yang valid untuk validasi impor */
const VALID_BLOCK_TYPES = new Set<string>([
  ...Object.values(BLOCK_TYPES),
  'rk_text',
]);

// ─── Ekspor ───────────────────────────────────────────────────────────────────

/**
 * Mengekspor workspace Blockly ke file JSON dan mengunduhnya.
 */
export function exportProjectAsJSON(
  workspace: Blockly.Workspace,
  projectName: string
): void {
  const workspaceData = Blockly.serialization.workspaces.save(workspace) as BlocklyWorkspaceData;

  const projectFile: LocalProjectFile = {
    format: PROJECT_FORMAT,
    version: PROJECT_VERSION,
    projectName: sanitizeProjectName(projectName),
    workspace: workspaceData,
    savedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(projectFile, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Buat link download sementara
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(projectName)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Impor ────────────────────────────────────────────────────────────────────

export interface ImportResult {
  success: boolean;
  projectName?: string;
  error?: string;
}

/**
 * Membuka dialog pilih file JSON dan mengimpor ke workspace.
 * Workspace TIDAK dimodifikasi jika impor gagal.
 */
export function importProjectFromFile(
  workspace: Blockly.Workspace,
  onResult: (result: ImportResult) => void
): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) {
      onResult({ success: false, error: 'Tidak ada file yang dipilih.' });
      return;
    }

    readAndImportFile(file, workspace, onResult);
  });

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

/** Membaca file dan menjalankan validasi + import */
function readAndImportFile(
  file: File,
  workspace: Blockly.Workspace,
  onResult: (result: ImportResult) => void
): void {
  // Validasi ukuran
  if (file.size > MAX_FILE_SIZE_BYTES) {
    onResult({
      success: false,
      error: `❌ File terlalu besar (maks 2MB). Ukuran file: ${(file.size / 1024).toFixed(0)} KB.`,
    });
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    const text = event.target?.result;
    if (typeof text !== 'string') {
      onResult({ success: false, error: '❌ Gagal membaca file.' });
      return;
    }

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      onResult({ success: false, error: '❌ File tidak valid: bukan format JSON yang benar.' });
      return;
    }

    // Validasi struktur
    const validationError = validateProjectFile(parsed);
    if (validationError) {
      onResult({ success: false, error: validationError });
      return;
    }

    const project = parsed as LocalProjectFile;

    // Validasi jenis blok di dalam workspace
    const blockTypeError = validateWorkspaceBlockTypes(project.workspace);
    if (blockTypeError) {
      onResult({ success: false, error: blockTypeError });
      return;
    }

    // Semua validasi lulus — bersihkan blok lama dan muat ke workspace
    try {
      workspace.clear();
      Blockly.serialization.workspaces.load(project.workspace, workspace);
      onResult({ success: true, projectName: project.projectName });
    } catch (err) {
      onResult({
        success: false,
        error: `❌ Gagal memuat workspace: ${err instanceof Error ? err.message : 'Error tidak diketahui'}.`,
      });
    }
  });

  reader.addEventListener('error', () => {
    onResult({ success: false, error: '❌ Gagal membaca file dari disk.' });
  });

  reader.readAsText(file, 'UTF-8');
}

// ─── Validasi ─────────────────────────────────────────────────────────────────

/** Mengembalikan pesan error atau null jika valid */
function validateProjectFile(data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return '❌ Format file tidak valid: harus berupa objek JSON.';
  }

  const obj = data as Record<string, unknown>;

  // Cek format
  if (obj['format'] !== PROJECT_FORMAT) {
    return `❌ Format file tidak dikenal: "${obj['format']}". Hanya file RoboKreasi yang dapat diimpor.`;
  }

  // Cek versi
  if (typeof obj['version'] !== 'number' || obj['version'] < 1) {
    return `❌ Versi file tidak valid: "${obj['version']}". File mungkin terlalu lama atau rusak.`;
  }

  if (obj['version'] > PROJECT_VERSION) {
    return `❌ Versi file (${obj['version']}) lebih baru dari aplikasi ini (${PROJECT_VERSION}). Perbarui aplikasi terlebih dahulu.`;
  }

  // Cek nama proyek
  if (typeof obj['projectName'] !== 'string' || !obj['projectName'].trim()) {
    return '❌ Nama proyek tidak valid dalam file.';
  }

  // Cek workspace
  if (!obj['workspace'] || typeof obj['workspace'] !== 'object' || Array.isArray(obj['workspace'])) {
    return '❌ Data workspace tidak valid dalam file.';
  }
  return null;
}

/** Memeriksa apakah ada jenis blok yang tidak dikenal di workspace */
function validateWorkspaceBlockTypes(workspace: BlocklyWorkspaceData): string | null {
  const blocks = (workspace as Record<string, unknown>)['blocks'];
  if (!blocks || typeof blocks !== 'object' || Array.isArray(blocks)) {
    return null; // workspace kosong — valid
  }

  const blocksObj = blocks as Record<string, unknown>;
  const blockList = blocksObj['blocks'];
  if (!Array.isArray(blockList)) {
    return null;
  }

  const unknownTypes: string[] = [];
  collectBlockTypes(blockList, unknownTypes);

  if (unknownTypes.length > 0) {
    const uniqueUnknown = [...new Set(unknownTypes)];
    return (
      `❌ File mengandung blok yang tidak dikenal: ${uniqueUnknown.join(', ')}. ` +
      `File ini mungkin dibuat untuk versi yang berbeda.`
    );
  }

  return null;
}

/** Rekursif mengumpulkan jenis blok yang tidak dikenal */
function collectBlockTypes(blocks: unknown[], unknownTypes: string[]): void {
  for (const block of blocks) {
    if (!block || typeof block !== 'object' || Array.isArray(block)) continue;
    const b = block as Record<string, unknown>;

    const type = b['type'];
    if (typeof type === 'string' && !VALID_BLOCK_TYPES.has(type)) {
      unknownTypes.push(type);
    }

    // Rekursi ke child blocks
    if (b['inputs'] && typeof b['inputs'] === 'object') {
      const inputs = b['inputs'] as Record<string, unknown>;
      for (const inputKey of Object.keys(inputs)) {
        const input = inputs[inputKey] as Record<string, unknown>;
        if (input['block']) {
          collectBlockTypes([input['block']], unknownTypes);
        }
        if (Array.isArray(input['shadow'])) {
          collectBlockTypes(input['shadow'] as unknown[], unknownTypes);
        }
      }
    }

    if (Array.isArray(b['next'])) {
      collectBlockTypes(b['next'] as unknown[], unknownTypes);
    }

    if (b['next'] && typeof b['next'] === 'object') {
      const next = b['next'] as Record<string, unknown>;
      if (next['block']) {
        collectBlockTypes([next['block']], unknownTypes);
      }
    }
  }
}

// ─── Loader dari Proyek Contoh (dari backend) ─────────────────────────────────

/**
 * Memuat proyek contoh dari backend ke workspace.
 * workspace_json sudah tervalidasi oleh backend.
 */
export function loadExampleProject(
  workspace: Blockly.Workspace,
  workspaceData: BlocklyWorkspaceData
): { success: boolean; error?: string } {
  try {
    const blockTypeError = validateWorkspaceBlockTypes(workspaceData);
    if (blockTypeError) {
      return { success: false, error: blockTypeError };
    }

    // Bersihkan workspace terlebih dahulu agar blok lama tidak menumpuk
    workspace.clear();
    Blockly.serialization.workspaces.load(workspaceData, workspace);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `❌ Gagal memuat proyek contoh: ${err instanceof Error ? err.message : 'Error tidak diketahui'}.`,
    };
  }
}

// ─── Utilitas ─────────────────────────────────────────────────────────────────

function sanitizeProjectName(name: string): string {
  return String(name).trim().slice(0, 100) || 'Proyek Saya';
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50) || 'robokreasi_proyek';
}
