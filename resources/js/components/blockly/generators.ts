/**
 * RoboKreasi — Generator JavaScript untuk semua blok Blockly
 * Menghasilkan kode yang menggunakan SimulatorAPI yang dibatasi.
 * Menggunakan Blockly 13.x JavaScript Generator.
 *
 * PENTING: Kode yang dihasilkan TIDAK menggunakan eval() atau new Function().
 * Kode dikirim ke Web Worker untuk eksekusi terisolasi.
 */

import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { BLOCK_TYPES } from '../../types/robokreasi';

// ─── Custom scrub_ untuk Event Blocks ────────────────────────────────────────

const originalScrub = javascriptGenerator.scrub_.bind(javascriptGenerator);

// Jangan append nextBlock di luar wrapper event_start / event_key_pressed
javascriptGenerator.scrub_ = function (
  block: Blockly.Block,
  code: string,
  thisOnly?: boolean
): string {
  if (
    block.type === BLOCK_TYPES.EVENT_START ||
    block.type === BLOCK_TYPES.EVENT_KEY_PRESSED
  ) {
    return code;
  }
  return originalScrub(block, code, thisOnly);
};

// ─── KEJADIAN ─────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.EVENT_START] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const nextBlock = block.getNextBlock();
  const body = nextBlock ? generator.blockToCode(nextBlock) : '';
  return `// [event_start]\nasync function __program__() {\n${body}}\nawait __program__();\n`;
};

// Catatan: event_key_pressed diimplementasikan sebagai event handler di runtime
javascriptGenerator.forBlock[BLOCK_TYPES.EVENT_KEY_PRESSED] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const key = block.getFieldValue('KEY');
  const nextBlock = block.getNextBlock();
  const body = nextBlock ? generator.blockToCode(nextBlock) : '';
  return `// [event_key_pressed: ${key}]\nasync function __onKey_${key.replace(/[^a-zA-Z0-9]/g, '_')}__() {\n${body}}\n__robot__.daftarkanKeyHandler('${key}', __onKey_${key.replace(/[^a-zA-Z0-9]/g, '_')}__);\n`;
};

// ─── GERAKAN ──────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_FORWARD] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const steps = generator.valueToCode(block, 'STEPS', Order.ATOMIC) || '1';
  return `await __robot__.maju(${steps});\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_BACKWARD] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const steps = generator.valueToCode(block, 'STEPS', Order.ATOMIC) || '1';
  return `await __robot__.mundur(${steps});\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_TURN_LEFT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const degrees = generator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '90';
  return `await __robot__.belokKiri(${degrees});\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_TURN_RIGHT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const degrees = generator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '90';
  return `await __robot__.belokKanan(${degrees});\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_STOP] = function () {
  return `await __robot__.berhenti();\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.MOTION_SET_SPEED] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const speed = generator.valueToCode(block, 'SPEED', Order.ATOMIC) || '5';
  return `__robot__.aturKecepatan(${speed});\n`;
};

// ─── KONTROL ──────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.CONTROL_REPEAT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const times = generator.valueToCode(block, 'TIMES', Order.ATOMIC) || '1';
  const body = generator.statementToCode(block, 'DO') || '';
  // Tambahkan pemeriksaan iterasi dan pembatalan
  return (
    `for (let __i__ = 0; __i__ < (${times}); __i__++) {\n` +
    `  __robot__.cekDibatalkan();\n` +
    `  __iterasi__++;\n` +
    `  if (__iterasi__ > __maxIterasi__) throw new Error('Terlalu banyak iterasi. Program dihentikan untuk keamanan.');\n` +
    `${body}` +
    `}\n`
  );
};

javascriptGenerator.forBlock[BLOCK_TYPES.CONTROL_FOREVER] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const body = generator.statementToCode(block, 'DO') || '';
  return (
    `while (true) {\n` +
    `  __robot__.cekDibatalkan();\n` +
    `  await __robot__.tidur(50);\n` +
    `  __iterasi__++;\n` +
    `  if (__iterasi__ > __maxIterasi__) throw new Error('Loop selamanya mencapai batas. Program dihentikan.');\n` +
    `${body}` +
    `}\n`
  );
};

javascriptGenerator.forBlock[BLOCK_TYPES.CONTROL_IF] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const body = generator.statementToCode(block, 'DO') || '';
  return `if (${condition}) {\n${body}}\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.CONTROL_IF_ELSE] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const doBody = generator.statementToCode(block, 'DO') || '';
  const elseBody = generator.statementToCode(block, 'ELSE') || '';
  return `if (${condition}) {\n${doBody}} else {\n${elseBody}}\n`;
};

// ─── OPERATOR ─────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_NUMBER] = function (
  block: Blockly.Block
) {
  const num = block.getFieldValue('NUM') || '0';
  return [num, Order.ATOMIC];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_ADD] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const a = generator.valueToCode(block, 'A', Order.ADDITION) || '0';
  const b = generator.valueToCode(block, 'B', Order.ADDITION) || '0';
  return [`(${a} + ${b})`, Order.ADDITION];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_SUBTRACT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const a = generator.valueToCode(block, 'A', Order.SUBTRACTION) || '0';
  const b = generator.valueToCode(block, 'B', Order.SUBTRACTION) || '0';
  return [`(${a} - ${b})`, Order.SUBTRACTION];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_COMPARE] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const op = block.getFieldValue('OP') || '===';
  const a = generator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
  const b = generator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
  const orderMap: Record<string, Order> = {
    '===': Order.EQUALITY,
    '!==': Order.EQUALITY,
    '<': Order.RELATIONAL,
    '<=': Order.RELATIONAL,
    '>': Order.RELATIONAL,
    '>=': Order.RELATIONAL,
  };
  return [`(${a} ${op} ${b})`, orderMap[op] || Order.RELATIONAL];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_AND] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const a = generator.valueToCode(block, 'A', Order.LOGICAL_AND) || 'false';
  const b = generator.valueToCode(block, 'B', Order.LOGICAL_AND) || 'false';
  return [`(${a} && ${b})`, Order.LOGICAL_AND];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_OR] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const a = generator.valueToCode(block, 'A', Order.LOGICAL_OR) || 'false';
  const b = generator.valueToCode(block, 'B', Order.LOGICAL_OR) || 'false';
  return [`(${a} || ${b})`, Order.LOGICAL_OR];
};

javascriptGenerator.forBlock[BLOCK_TYPES.OPERATOR_NOT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const val = generator.valueToCode(block, 'VALUE', Order.LOGICAL_NOT) || 'false';
  return [`(!${val})`, Order.LOGICAL_NOT];
};

// ─── VARIABEL ─────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.VARIABLE_SET] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const varName = block.getFieldValue('VAR') || 'x';
  // Sanitasi nama variabel: hanya huruf, angka, underscore
  const safe = varName.replace(/[^a-zA-Z0-9_]/g, '_');
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  return `__vars__['${safe}'] = ${value};\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.VARIABLE_CHANGE] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const varName = block.getFieldValue('VAR') || 'x';
  const safe = varName.replace(/[^a-zA-Z0-9_]/g, '_');
  const value = generator.valueToCode(block, 'VALUE', Order.ADDITION) || '1';
  return `__vars__['${safe}'] = (__vars__['${safe}'] || 0) + ${value};\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.VARIABLE_GET] = function (
  block: Blockly.Block
) {
  const varName = block.getFieldValue('VAR') || 'x';
  const safe = varName.replace(/[^a-zA-Z0-9_]/g, '_');
  return [`(__vars__['${safe}'] ?? 0)`, Order.MEMBER];
};

// ─── SENSOR ───────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.SENSOR_OBSTACLE] = function () {
  return [`__robot__.cekRintangan()`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock[BLOCK_TYPES.SENSOR_LINE] = function () {
  return [`__robot__.cekGaris()`, Order.FUNCTION_CALL];
};

// ─── TAMPILAN ─────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.DISPLAY_TEXT] = function (
  block: Blockly.Block,
  generator: typeof javascriptGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || '""';
  return `__robot__.tampilkanTeks(String(${text}));\nawait __robot__.tidur(500);\n`;
};

// ─── SUARA ────────────────────────────────────────────────────────────────────

javascriptGenerator.forBlock[BLOCK_TYPES.SOUND_PLAY_TONE] = function (
  block: Blockly.Block
) {
  const note = block.getFieldValue('NOTE') || 'C4';
  const duration = block.getFieldValue('DURATION') || '500';
  return `await __robot__.mainkanNada('${note}', ${duration});\n`;
};

javascriptGenerator.forBlock[BLOCK_TYPES.SOUND_STOP] = function () {
  return `__robot__.hentikanSuara();\n`;
};

// ─── Teks sederhana ───────────────────────────────────────────────────────────

javascriptGenerator.forBlock['rk_text'] = function (block: Blockly.Block) {
  const text = block.getFieldValue('TEXT') || '';
  // Escape string dengan aman
  const escaped = JSON.stringify(text);
  return [escaped, Order.ATOMIC];
};

// ─── Fungsi utilitas untuk generate kode ─────────────────────────────────────

/**
 * Menghasilkan kode JavaScript dari workspace Blockly.
 * Kode ini BELUM dieksekusi — hanya string yang akan dikirim ke Worker.
 */
export function generateProgramCode(workspace: Blockly.Workspace): {
  code: string;
  hasEventStart: boolean;
  topBlocks: string[];
} {
  // Cek blok paling atas
  const topBlocks = workspace.getTopBlocks(true);
  const hasEventStart = topBlocks.some((b: Blockly.Block) => b.type === BLOCK_TYPES.EVENT_START);
  const topBlockTypes = topBlocks.map((b: Blockly.Block) => b.type);

  // Generate kode
  const rawCode = javascriptGenerator.workspaceToCode(workspace);

  // Bungkus dengan header keamanan
  const wrappedCode = wrapWithSafetyHeader(rawCode);

  return {
    code: wrappedCode,
    hasEventStart,
    topBlocks: topBlockTypes,
  };
}

/**
 * Tambahkan header keamanan dan inisialisasi variabel runtime.
 * Kode ini dieksekusi di dalam Worker yang sudah terisolasi.
 */
function wrapWithSafetyHeader(code: string): string {
  return `
// === RoboKreasi Program Code ===
// Dihasilkan otomatis — jangan edit manual
"use strict";

// Inisialisasi variabel program
const __vars__ = {};
let __iterasi__ = 0;
const __maxIterasi__ = __config__.maxIterations;

// Jalankan program
try {
${code}
} catch (e) {
  if (e.message === '__PROGRAM_CANCELLED__') {
    // Program dihentikan oleh pengguna — bukan error
  } else {
    throw e;
  }
}
`;
}

