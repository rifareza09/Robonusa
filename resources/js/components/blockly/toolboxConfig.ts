/**
 * RoboKreasi — Definisi Toolbox Blockly
 * Mendefinisikan kategori dan blok yang tersedia di panel kiri.
 * Format toolbox menggunakan XML string yang kompatibel dengan Blockly 13.x
 */

import { BLOCK_TYPES } from '../../types/robokreasi';
import { COLORS } from './blockDefinitions';

/**
 * Menghasilkan konfigurasi toolbox sebagai objek JSON (Blockly 10+ mendukung format JSON)
 * Dikompilasi dari blok yang terdaftar di blockDefinitions.ts
 */
export function buildToolboxConfig(): Blockly.utils.toolbox.ToolboxDefinition {
  return {
    kind: 'categoryToolbox',
    contents: [
      // ── KEJADIAN ────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '⚡ Kejadian',
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

      // ── GERAKAN ─────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '🤖 Gerakan',
        colour: COLORS.GERAKAN,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.MOTION_FORWARD,
            inputs: {
              STEPS: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 1 },
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
                  fields: { NUM: 1 },
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

      // ── KONTROL ─────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '🔄 Kontrol',
        colour: COLORS.KONTROL,
        contents: [
          {
            kind: 'block',
            type: BLOCK_TYPES.CONTROL_REPEAT,
            inputs: {
              TIMES: {
                block: {
                  type: BLOCK_TYPES.OPERATOR_NUMBER,
                  fields: { NUM: 10 },
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

      // ── OPERATOR ─────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '🔢 Operator',
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

      // ── VARIABEL ─────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '📦 Variabel',
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

      // ── SENSOR ───────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '📡 Sensor',
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

      // ── TAMPILAN ─────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '💬 Tampilan',
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

      // ── SUARA ────────────────────────────────────────────────────────────
      {
        kind: 'category',
        name: '🔔 Suara',
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

