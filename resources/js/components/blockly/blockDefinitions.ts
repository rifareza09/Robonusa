/**
 * RoboKreasi — Definisi Blok Blockly Bahasa Indonesia
 * Semua blok terdaftar di sini dengan definisi, tooltip, dan koneksi yang benar.
 * Menggunakan Blockly 13.x API.
 */

import * as Blockly from 'blockly';
import { BLOCK_TYPES } from '../../types/robokreasi';

// Warna kategori resmi sesuai Figma Racero Scratch ("media_1793274976879_5060280a.png")
const COLORS = {
  GERAKAN: '#2563EB',   // Figma Racero: Biru (#2563EB)
  KONTROL: '#D97706',   // Figma Racero: Amber / Cokelat Keemasan (#D97706)
  SENSOR: '#7C3AED',    // Figma Racero: Ungu (#7C3AED)
  OPERATOR: '#DB2777',  // Figma Racero: Magenta / Logika (#DB2777)
  VARIABEL: '#EA580C',  // Figma Racero: Oranye Kemerahan (#EA580C)
  KEJADIAN: '#0D9488',  // Figma Racero: Hijau Toska / Teal (#0D9488)
  TAMPILAN: '#8B5CF6',  // Figma Racero: Violet (#8B5CF6)
  SUARA: '#6366F1',     // Figma Racero: Indigo (#6366F1)
} as const;

// ─── KEJADIAN ─────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.EVENT_START] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('🚀')
      .appendField('Saat Mulai Diklik');
    this.setNextStatement(true, null);
    this.setColour(COLORS.KEJADIAN);
    this.setTooltip('Blok ini dijalankan saat tombol Mulai diklik.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.EVENT_KEY_PRESSED] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('⌨️')
      .appendField('Saat tombol')
      .appendField(
        new Blockly.FieldDropdown([
          ['Spasi', 'space'],
          ['Panah Atas', 'ArrowUp'],
          ['Panah Bawah', 'ArrowDown'],
          ['Panah Kiri', 'ArrowLeft'],
          ['Panah Kanan', 'ArrowRight'],
          ['A', 'a'],
          ['B', 'b'],
          ['C', 'c'],
          ['D', 'd'],
        ]),
        'KEY'
      )
      .appendField('ditekan');
    this.setNextStatement(true, null);
    this.setColour(COLORS.KEJADIAN);
    this.setTooltip('Blok ini dijalankan saat tombol keyboard tertentu ditekan.');
    this.setHelpUrl('');
  },
};

// ─── GERAKAN ──────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.MOTION_FORWARD] = {
  init(this: Blockly.Block) {
    this.appendValueInput('STEPS')
      .setCheck('Number')
      .appendField('Maju sejauh');
    this.appendDummyInput().appendField('cm');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Robot bergerak maju sejauh nilai yang ditentukan.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.MOTION_BACKWARD] = {
  init(this: Blockly.Block) {
    this.appendValueInput('STEPS')
      .setCheck('Number')
      .appendField('Mundur sejauh');
    this.appendDummyInput().appendField('cm');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Robot bergerak mundur sejauh nilai yang ditentukan.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.MOTION_TURN_LEFT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DEGREES')
      .setCheck('Number')
      .appendField('↰')
      .appendField('Putar ke kiri');
    this.appendDummyInput().appendField('°');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Robot berputar ke kiri.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.MOTION_TURN_RIGHT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DEGREES')
      .setCheck('Number')
      .appendField('↱')
      .appendField('Putar ke kanan');
    this.appendDummyInput().appendField('°');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Robot berputar ke kanan.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.MOTION_STOP] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('○')
      .appendField('Berhenti');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Robot berhenti bergerak.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.MOTION_SET_SPEED] = {
  init(this: Blockly.Block) {
    this.appendValueInput('SPEED')
      .setCheck('Number')
      .appendField('⚡')
      .appendField('Atur Kecepatan');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.GERAKAN);
    this.setTooltip('Atur kecepatan robot (1-10). Kecepatan default adalah 5.');
    this.setHelpUrl('');
  },
};

// ─── KONTROL ──────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.CONTROL_REPEAT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('TIMES')
      .setCheck('Number')
      .appendField('🔁')
      .appendField('Ulangi');
    this.appendDummyInput().appendField('kali');
    this.appendStatementInput('DO').appendField('lakukan');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.KONTROL);
    this.setTooltip('Menjalankan blok di dalamnya sebanyak N kali.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.CONTROL_FOREVER] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('♾️')
      .appendField('Selamanya');
    this.appendStatementInput('DO').appendField('lakukan');
    this.setPreviousStatement(true, null);
    this.setNextStatement(false, null);  // tidak ada blok setelah "selamanya"
    this.setColour(COLORS.KONTROL);
    this.setTooltip('Menjalankan blok di dalamnya terus menerus (dibatasi sistem).');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.CONTROL_IF] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION')
      .setCheck('Boolean')
      .appendField('❓')
      .appendField('Jika');
    this.appendDummyInput().appendField('maka');
    this.appendStatementInput('DO').appendField('lakukan');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.KONTROL);
    this.setTooltip('Menjalankan blok di dalamnya jika kondisi benar.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.CONTROL_IF_ELSE] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION')
      .setCheck('Boolean')
      .appendField('❓')
      .appendField('Jika');
    this.appendDummyInput().appendField('maka');
    this.appendStatementInput('DO').appendField('lakukan');
    this.appendDummyInput().appendField('jika tidak');
    this.appendStatementInput('ELSE').appendField('lakukan');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.KONTROL);
    this.setTooltip('Menjalankan blok pertama jika kondisi benar, blok kedua jika tidak.');
    this.setHelpUrl('');
  },
};

// ─── OPERATOR ─────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.OPERATOR_NUMBER] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(10, -1000, 1000), 'NUM');
    this.setOutput(true, 'Number');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Nilai angka.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_ADD] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('+');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Menjumlahkan dua angka.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_SUBTRACT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('−');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Mengurangkan dua angka.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_COMPARE] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B')
      .setCheck('Number')
      .appendField(
        new Blockly.FieldDropdown([
          ['=', '==='],
          ['≠', '!=='],
          ['<', '<'],
          ['≤', '<='],
          ['>', '>'],
          ['≥', '>='],
        ]),
        'OP'
      );
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Membandingkan dua nilai dan menghasilkan benar atau salah.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_AND] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Boolean');
    this.appendValueInput('B').setCheck('Boolean').appendField('DAN');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Benar jika kedua kondisi benar.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_OR] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Boolean');
    this.appendValueInput('B').setCheck('Boolean').appendField('ATAU');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Benar jika salah satu kondisi benar.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.OPERATOR_NOT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('VALUE')
      .setCheck('Boolean')
      .appendField('TIDAK');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.OPERATOR);
    this.setTooltip('Membalik nilai kondisi (benar menjadi salah, salah menjadi benar).');
    this.setHelpUrl('');
  },
};

// ─── VARIABEL ─────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.VARIABLE_SET] = {
  init(this: Blockly.Block) {
    this.appendValueInput('VALUE')
      .appendField('📦')
      .appendField('Atur variabel')
      .appendField(new Blockly.FieldTextInput('x'), 'VAR')
      .appendField('=');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.VARIABEL);
    this.setTooltip('Mengatur nilai variabel.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.VARIABLE_CHANGE] = {
  init(this: Blockly.Block) {
    this.appendValueInput('VALUE')
      .appendField('📦')
      .appendField('Ubah variabel')
      .appendField(new Blockly.FieldTextInput('x'), 'VAR')
      .appendField('tambah');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.VARIABEL);
    this.setTooltip('Menambah atau mengurangi nilai variabel.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.VARIABLE_GET] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('📦')
      .appendField('Ambil')
      .appendField(new Blockly.FieldTextInput('x'), 'VAR');
    this.setOutput(true, null);  // bisa Number atau String
    this.setColour(COLORS.VARIABEL);
    this.setTooltip('Mengambil nilai variabel.');
    this.setHelpUrl('');
  },
};

// ─── SENSOR ───────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.SENSOR_OBSTACLE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('🚧')
      .appendField('Ada rintangan?');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.SENSOR);
    this.setTooltip('Mengembalikan BENAR jika ada rintangan di depan robot.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.SENSOR_LINE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('〰️')
      .appendField('Di atas garis?');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.SENSOR);
    this.setTooltip('Mengembalikan BENAR jika robot berada di atas garis.');
    this.setHelpUrl('');
  },
};

// ─── TAMPILAN ─────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.DISPLAY_TEXT] = {
  init(this: Blockly.Block) {
    this.appendValueInput('TEXT')
      .appendField('💬')
      .appendField('Tampilkan');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.TAMPILAN);
    this.setTooltip('Menampilkan teks pada layar simulator.');
    this.setHelpUrl('');
  },
};

// ─── SUARA ────────────────────────────────────────────────────────────────────

Blockly.Blocks[BLOCK_TYPES.SOUND_PLAY_TONE] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('🔔')
      .appendField('Mainkan nada')
      .appendField(
        new Blockly.FieldDropdown([
          ['Do', 'C4'],
          ['Re', 'D4'],
          ['Mi', 'E4'],
          ['Fa', 'F4'],
          ['Sol', 'G4'],
          ['La', 'A4'],
          ['Si', 'B4'],
          ['Do Tinggi', 'C5'],
        ]),
        'NOTE'
      )
      .appendField('selama')
      .appendField(new Blockly.FieldNumber(500, 100, 5000, 100), 'DURATION')
      .appendField('ms');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.SUARA);
    this.setTooltip('Memainkan nada selama durasi yang ditentukan.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[BLOCK_TYPES.SOUND_STOP] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('🔇')
      .appendField('Hentikan Suara');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.SUARA);
    this.setTooltip('Menghentikan suara yang sedang diputar.');
    this.setHelpUrl('');
  },
};

// ─── Blok teks sederhana (untuk DISPLAY_TEXT) ────────────────────────────────

Blockly.Blocks['rk_text'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('"')
      .appendField(new Blockly.FieldTextInput('Halo Robot!'), 'TEXT')
      .appendField('"');
    this.setOutput(true, 'String');
    this.setColour(COLORS.TAMPILAN);
    this.setTooltip('Teks yang akan ditampilkan.');
    this.setHelpUrl('');
  },
};

export { COLORS };

