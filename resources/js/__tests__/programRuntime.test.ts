/**
 * Tests — Validasi Program Runtime
 */

import { describe, it, expect } from 'vitest';
import { validateProgram } from '../lib/programRuntime';
import { BLOCK_TYPES } from '../types/robokreasi';

describe('validateProgram', () => {
  it('harus valid jika ada event_start dan semua blok dikenal', () => {
    const result = validateProgram(
      [BLOCK_TYPES.EVENT_START],
      [BLOCK_TYPES.EVENT_START, BLOCK_TYPES.MOTION_FORWARD, BLOCK_TYPES.OPERATOR_NUMBER]
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('harus ditolak jika tidak ada event_start', () => {
    const result = validateProgram(
      [BLOCK_TYPES.MOTION_FORWARD],
      [BLOCK_TYPES.MOTION_FORWARD]
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Saat Mulai Diklik');
  });

  it('harus ditolak jika ada blok tidak dikenal', () => {
    const result = validateProgram(
      [BLOCK_TYPES.EVENT_START],
      [BLOCK_TYPES.EVENT_START, 'blok_asing_123']
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('blok_asing_123'))).toBe(true);
  });

  it('harus valid jika menggunakan rk_text', () => {
    const result = validateProgram(
      [BLOCK_TYPES.EVENT_START],
      [BLOCK_TYPES.EVENT_START, BLOCK_TYPES.DISPLAY_TEXT, 'rk_text']
    );
    expect(result.valid).toBe(true);
  });

  it('harus mengumpulkan semua error sekaligus', () => {
    const result = validateProgram(
      ['motion_forward'],  // tidak ada event_start
      ['motion_forward', 'blok_asing_a', 'blok_asing_b']
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3); // 1 event_start + 2 blok asing
  });
});

describe('BLOCK_TYPES konstanta', () => {
  it('harus memiliki semua jenis blok yang diperlukan', () => {
    expect(BLOCK_TYPES.EVENT_START).toBe('event_start');
    expect(BLOCK_TYPES.MOTION_FORWARD).toBe('motion_forward');
    expect(BLOCK_TYPES.CONTROL_REPEAT).toBe('control_repeat');
    expect(BLOCK_TYPES.SENSOR_OBSTACLE).toBe('sensor_obstacle');
    expect(BLOCK_TYPES.DISPLAY_TEXT).toBe('display_text');
    expect(BLOCK_TYPES.SOUND_PLAY_TONE).toBe('sound_play_tone');
  });

  it('semua jenis blok harus berupa string non-kosong', () => {
    for (const [key, value] of Object.entries(BLOCK_TYPES)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
      expect(value).toMatch(/^[a-z_]+$/); // hanya huruf kecil dan underscore
    }
  });
});

