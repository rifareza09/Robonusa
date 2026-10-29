/**
 * RoboKreasi — Definisi Toolbox Blockly
 * Mendefinisikan kategori dan blok yang tersedia di panel kiri.
 * Format toolbox menggunakan JSON format yang kompatibel dengan Blockly 13.x
 * Mengacu pada desain Figma Racero Scratch ("media_1793274976879_5060280a.png")
 */

import { BLOCK_TYPES } from '../../types/robokreasi';
import { COLORS } from './blockDefinitions';

/**
 * Menghasilkan konfigurasi toolbox sebagai objek JSON
 * Dikompilasi dari blok yang terdaftar di blockDefinitions.ts
 */
export function buildToolboxConfig(): Blockly.utils.toolbox.ToolboxDefinition {
  return {
    kind: 'categoryToolbox',
    contents: [
      // ── GERAKAN (Utama di Figma: Biru #2563EB) ───────────────────────────
      {
        kind: 'category',
        id: 'cat_gerakan',
        name: 'Gerakan',
        colour: COLORS.GERAKAN,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_FORWARD,
            inputs: {
              STEPS: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 10 },
                },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_BACKWARD,
            inputs: {
              STEPS: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 10 },
                },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_TURN_RIGHT,
            inputs: {
              DEGREES: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 90 },
                },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_TURN_LEFT,
            inputs: {
              DEGREES: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 90 },
                },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_STOP,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_SET_SPEED,
            inputs: {
              SPEED: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 5 },
                },
              },
            },
          },
        ],
      },

      // ── KONTROL (Figma: Amber #D97706) ───────────────────────────────────
      {
        kind: 'category',
        id: 'cat_kontrol',
        name: 'Kontrol',
        colour: COLORS.KONTROL,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.CONTROL_REPEAT,
            inputs: {
              TIMES: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 3 },
                },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.CONTROL_FOREVER,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.CONTROL_IF,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.CONTROL_IF_ELSE,
          },
        ],
      },

      // ── SENSOR (Figma: Ungu #7C3AED) ─────────────────────────────────────
      {
        kind: 'category',
        id: 'cat_sensor',
        name: 'Sensor',
        colour: COLORS.SENSOR,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.SENSOR_OBSTACLE,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.SENSOR_LINE,
          },
        ],
      },

      // ── LOGIKA / OPERATOR (Figma: Magenta #DB2777) ───────────────────────
      {
        kind: 'category',
        id: 'cat_operator',
        name: 'Logika (Operator)',
        colour: COLORS.OPERATOR,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_NUMBER,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_ADD,
            inputs: {
              A: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
              B: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_SUBTRACT,
            inputs: {
              A: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
              B: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_COMPARE,
            inputs: {
              A: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
              B: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_AND,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_OR,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.OPERATOR_NOT,
          },
        ],
      },

      // ── VARIABEL (Figma: Oranye Kemerahan #EA580C) ───────────────────────
      {
        kind: 'category',
        id: 'cat_variabel',
        name: 'Variabel',
        colour: COLORS.VARIABEL,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.VARIABLE_SET,
            inputs: {
              VALUE: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 0 } },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.VARIABLE_CHANGE,
            inputs: {
              VALUE: {
                block: { type: BLOCK_TYPES.OPERATOR_NUMBER, fields: { NUM: 1 } },
              },
            },
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.VARIABLE_GET,
          },
        ],
      },

      // ── KEJADIAN (Figma: Teal #0D9488) ───────────────────────────────────
      {
        kind: 'category',
        id: 'cat_kejadian',
        name: 'Kejadian',
        colour: COLORS.KEJADIAN,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.EVENT_START,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.EVENT_KEY_PRESSED,
          },
        ],
      },

      // ── TAMPILAN (Figma: Violet #8B5CF6) ─────────────────────────────────
      {
        kind: 'category',
        id: 'cat_tampilan',
        name: 'Tampilan',
        colour: COLORS.TAMPILAN,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.DISPLAY_TEXT,
            inputs: {
              TEXT: {
                block: {
                  type: 'rk_text',
                  fields: { TEXT: 'Halo Robot!' },
                },
              },
            },
          },
        ],
      },

      // ── SUARA (Figma: Indigo #6366F1) ────────────────────────────────────
      {
        kind: 'category',
        id: 'cat_suara',
        name: 'Suara',
        colour: COLORS.SUARA,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.SOUND_PLAY_TONE,
          },
          {
            kind: 'block',
            type: BLOCK_TYPES.SOUND_STOP,
          },
        ],
      },
    ],
  };
}

// Import Blockly untuk tipe return
import type * as Blockly from 'blockly/core';
