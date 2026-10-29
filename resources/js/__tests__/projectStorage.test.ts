/**
 * Tests — Penyimpanan Proyek JSON Lokal
 */

import { describe, it, expect } from 'vitest';
import { PROJECT_FORMAT, PROJECT_VERSION } from '../types/robokreasi';

// ─── Fungsi utilitas untuk membuat struktur file yang valid ───────────────────

function makeValidProjectFile(overrides?: Record<string, unknown>) {
  return {
    format: PROJECT_FORMAT,
    version: PROJECT_VERSION,
    projectName: 'Proyek Test',
    workspace: {
      blocks: {
        languageVersion: 0,
        blocks: [],
      },
      variables: [],
    },
    savedAt: new Date().toISOString(),
    ...overrides,
  };
}

// Test validasi struktur file
describe('Format file proyek lokal', () => {
  it('format harus "robokreasi-project"', () => {
    expect(PROJECT_FORMAT).toBe('robokreasi-project');
  });

  it('versi harus 1', () => {
    expect(PROJECT_VERSION).toBe(1);
  });

  it('file valid harus memiliki semua field yang diperlukan', () => {
    const file = makeValidProjectFile();
    expect(file.format).toBe(PROJECT_FORMAT);
    expect(file.version).toBe(PROJECT_VERSION);
    expect(typeof file.projectName).toBe('string');
    expect(file.workspace).toBeDefined();
  });
});

// Test validasi manual (tanpa injeksi DOM)
describe('Validasi struktur file JSON', () => {
  function validateStructure(data: unknown): string | null {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return 'Bukan objek JSON';
    }
    const obj = data as Record<string, unknown>;
    if (obj['format'] !== PROJECT_FORMAT) return `Format tidak dikenal: "${obj['format']}"`;
    if (typeof obj['version'] !== 'number' || obj['version'] < 1) return 'Versi tidak valid';
    if (obj['version'] > PROJECT_VERSION) return 'Versi terlalu baru';
    if (typeof obj['projectName'] !== 'string' || !String(obj['projectName']).trim()) return 'Nama proyek tidak valid';
    if (!obj['workspace'] || typeof obj['workspace'] !== 'object' || Array.isArray(obj['workspace'])) return 'Workspace tidak valid';
    return null;
  }

  it('harus menerima file yang valid', () => {
    const file = makeValidProjectFile();
    expect(validateStructure(file)).toBeNull();
  });

  it('harus menolak jika format salah', () => {
    const file = makeValidProjectFile({ format: 'format-lain' });
    const err = validateStructure(file);
    expect(err).not.toBeNull();
    expect(err).toContain('format-lain');
  });

  it('harus menolak jika versi bukan number', () => {
    const file = makeValidProjectFile({ version: 'v1' });
    expect(validateStructure(file)).not.toBeNull();
  });

  it('harus menolak jika versi lebih baru dari aplikasi', () => {
    const file = makeValidProjectFile({ version: 999 });
    const err = validateStructure(file);
    expect(err).not.toBeNull();
    expect(err).toContain('terlalu baru');
  });

  it('harus menolak jika nama proyek kosong', () => {
    const file = makeValidProjectFile({ projectName: '   ' });
    expect(validateStructure(file)).not.toBeNull();
  });

  it('harus menolak jika workspace tidak ada', () => {
    const file = makeValidProjectFile({ workspace: null });
    expect(validateStructure(file)).not.toBeNull();
  });

  it('harus menolak jika workspace berupa array', () => {
    const file = makeValidProjectFile({ workspace: [] });
    expect(validateStructure(file)).not.toBeNull();
  });

  it('harus menolak nilai null', () => {
    expect(validateStructure(null)).not.toBeNull();
  });

  it('harus menolak nilai bukan objek', () => {
    expect(validateStructure('string')).not.toBeNull();
    expect(validateStructure(123)).not.toBeNull();
    expect(validateStructure([])).not.toBeNull();
  });
});

// Test validasi blok yang tidak dikenal
describe('Validasi jenis blok', () => {
  const VALID_TYPES = new Set([
    'event_start', 'event_key_pressed',
    'motion_forward', 'motion_backward', 'motion_turn_left', 'motion_turn_right',
    'motion_stop', 'motion_set_speed',
    'control_repeat', 'control_forever', 'control_if', 'control_if_else',
    'operator_add', 'operator_subtract', 'operator_compare', 'operator_and',
    'operator_or', 'operator_not', 'operator_number',
    'variable_set', 'variable_change', 'variable_get',
    'sensor_obstacle', 'sensor_line',
    'display_text',
    'sound_play_tone', 'sound_stop',
    'rk_text',
  ]);

  it('semua blok dalam BLOCK_TYPES harus ada di set valid', async () => {
    const { BLOCK_TYPES } = await import('../types/robokreasi');
    for (const blockType of Object.values(BLOCK_TYPES)) {
      expect(VALID_TYPES.has(blockType)).toBe(true);
    }
  });

  it('blok tidak dikenal harus terdeteksi', () => {
    expect(VALID_TYPES.has('blok_aneh_xyz')).toBe(false);
    expect(VALID_TYPES.has('event_start')).toBe(true);
  });
});

describe('loadExampleProject dengan Workspace', () => {
  it('harus berhasil memuat workspace_json yang valid', async () => {
    const Blockly = await import('blockly/core');
    await import('../components/blockly/blockDefinitions');
    const { loadExampleProject } = await import('../lib/projectStorage');

    const ws = new Blockly.Workspace();

    const validWorkspaceData = {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'event_start',
            id: 'start1',
            x: 20,
            y: 20,
          },
        ],
      },
    };

    const res = loadExampleProject(ws, validWorkspaceData);
    expect(res.success).toBe(true);
    expect(ws.getAllBlocks(false).length).toBe(1);
    expect(ws.getAllBlocks(false)[0].type).toBe('event_start');

    ws.dispose();
  });

  it('harus menolak workspace_json yang mengandung blok tidak dikenal', async () => {
    const Blockly = await import('blockly/core');
    await import('../components/blockly/blockDefinitions');
    const { loadExampleProject } = await import('../lib/projectStorage');

    const ws = new Blockly.Workspace();

    const invalidWorkspaceData = {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'blok_tidak_dikenal_hacker',
            id: 'bad1',
            x: 20,
            y: 20,
          },
        ],
      },
    };

    const res = loadExampleProject(ws, invalidWorkspaceData);
    expect(res.success).toBe(false);
    expect(res.error).toContain('blok yang tidak dikenal');
    // Workspace tidak boleh terisi blok yang tidak dikenal
    expect(ws.getAllBlocks(false).length).toBe(0);

    ws.dispose();
  });
});
