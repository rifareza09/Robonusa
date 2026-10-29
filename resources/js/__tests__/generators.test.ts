/**
 * Tests — Generator JavaScript & Blok Blockly
 * Menguji bahwa semua blok dapat dibuat di headless workspace dan menghasilkan kode JS yang benar.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import '../components/blockly/blockDefinitions';
import '../components/blockly/generators';
import { BLOCK_TYPES } from '../types/robokreasi';
import { generateProgramCode } from '../components/blockly/generators';

describe('Blockly Headless Workspace & Code Generation', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it('harus dapat membuat blok event_start dan mengenerate kode yang benar', () => {
    const block = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    expect(block).toBeDefined();
    expect(block.type).toBe('event_start');

    const result = generateProgramCode(workspace);
    expect(result.hasEventStart).toBe(true);
    expect(result.topBlocks).toContain('event_start');
    expect(result.code).toContain('__program__');
  });

  it('harus mengenerate kode gerakan: maju, mundur, belok, berhenti, atur kecepatan', () => {
    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);

    const fwd = workspace.newBlock(BLOCK_TYPES.MOTION_FORWARD);
    const numFwd = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    numFwd.setFieldValue('5', 'NUM');
    fwd.getInput('STEPS')?.connection?.connect(numFwd.outputConnection!);

    const back = workspace.newBlock(BLOCK_TYPES.MOTION_BACKWARD);
    const numBack = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    numBack.setFieldValue('2', 'NUM');
    back.getInput('STEPS')?.connection?.connect(numBack.outputConnection!);

    const turnL = workspace.newBlock(BLOCK_TYPES.MOTION_TURN_LEFT);
    const turnR = workspace.newBlock(BLOCK_TYPES.MOTION_TURN_RIGHT);
    const stop = workspace.newBlock(BLOCK_TYPES.MOTION_STOP);
    const speed = workspace.newBlock(BLOCK_TYPES.MOTION_SET_SPEED);

    // Hubungkan secara berurutan
    start.nextConnection?.connect(fwd.previousConnection!);
    fwd.nextConnection?.connect(back.previousConnection!);
    back.nextConnection?.connect(turnL.previousConnection!);
    turnL.nextConnection?.connect(turnR.previousConnection!);
    turnR.nextConnection?.connect(stop.previousConnection!);
    stop.nextConnection?.connect(speed.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('__robot__.maju(5)');
    expect(result.code).toContain('__robot__.mundur(2)');
    expect(result.code).toContain('__robot__.belokKiri');
    expect(result.code).toContain('__robot__.belokKanan');
    expect(result.code).toContain('__robot__.berhenti()');
    expect(result.code).toContain('__robot__.aturKecepatan');
  });

  it('harus mengenerate loop repeat dengan proteksi batas iterasi', () => {
    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    const repeat = workspace.newBlock(BLOCK_TYPES.CONTROL_REPEAT);
    const num = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    num.setFieldValue('4', 'NUM');
    repeat.getInput('TIMES')?.connection?.connect(num.outputConnection!);

    start.nextConnection?.connect(repeat.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('for (let __i__ = 0; __i__ < (4); __i__++)');
    expect(result.code).toContain('__robot__.cekDibatalkan()');
    expect(result.code).toContain('__iterasi__++');
    expect(result.code).toContain('__maxIterasi__');
  });

  it('harus mengenerate loop forever dengan proteksi iterasi', () => {
    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    const forever = workspace.newBlock(BLOCK_TYPES.CONTROL_FOREVER);
    start.nextConnection?.connect(forever.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('while (true)');
    expect(result.code).toContain('__robot__.cekDibatalkan()');
    expect(result.code).toContain('__maxIterasi__');
  });

  it('harus mengenerate percabangan if dan if-else', () => {
    const ifBlock = workspace.newBlock(BLOCK_TYPES.CONTROL_IF);
    const ifElseBlock = workspace.newBlock(BLOCK_TYPES.CONTROL_IF_ELSE);

    expect(ifBlock).toBeDefined();
    expect(ifElseBlock).toBeDefined();
  });

  it('harus mengenerate operasi variabel: set, change, get', () => {
    const setBlock = workspace.newBlock(BLOCK_TYPES.VARIABLE_SET);
    setBlock.setFieldValue('skor', 'VAR');
    const num = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    num.setFieldValue('10', 'NUM');
    setBlock.getInput('VALUE')?.connection?.connect(num.outputConnection!);

    const changeBlock = workspace.newBlock(BLOCK_TYPES.VARIABLE_CHANGE);
    changeBlock.setFieldValue('skor', 'VAR');

    const getBlock = workspace.newBlock(BLOCK_TYPES.VARIABLE_GET);
    getBlock.setFieldValue('skor', 'VAR');

    expect(setBlock).toBeDefined();
    expect(changeBlock).toBeDefined();
    expect(getBlock).toBeDefined();
  });

  it('harus mengenerate sensor obstacle dan sensor line', () => {
    const obs = workspace.newBlock(BLOCK_TYPES.SENSOR_OBSTACLE);
    const line = workspace.newBlock(BLOCK_TYPES.SENSOR_LINE);

    expect(obs.outputConnection).toBeDefined();
    expect(line.outputConnection).toBeDefined();
  });

  it('harus mengenerate suara dan tampilan', () => {
    const display = workspace.newBlock(BLOCK_TYPES.DISPLAY_TEXT);
    const textBlock = workspace.newBlock('rk_text');
    textBlock.setFieldValue('Halo Dunia', 'TEXT');
    display.getInput('TEXT')?.connection?.connect(textBlock.outputConnection!);

    const soundPlay = workspace.newBlock(BLOCK_TYPES.SOUND_PLAY_TONE);
    soundPlay.setFieldValue('G4', 'NOTE');
    soundPlay.setFieldValue('1000', 'DURATION');

    const soundStop = workspace.newBlock(BLOCK_TYPES.SOUND_STOP);

    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    start.nextConnection?.connect(display.previousConnection!);
    display.nextConnection?.connect(soundPlay.previousConnection!);
    soundPlay.nextConnection?.connect(soundStop.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('__robot__.tampilkanTeks(String("Halo Dunia"))');
    expect(result.code).toContain('__robot__.mainkanNada(\'G4\', 1000)');
    expect(result.code).toContain('__robot__.hentikanSuara()');
  });

  it('harus mengenerate operator matematika: add, subtract', () => {
    const add = workspace.newBlock(BLOCK_TYPES.OPERATOR_ADD);
    const num1 = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    num1.setFieldValue('10', 'NUM');
    const num2 = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    num2.setFieldValue('5', 'NUM');
    add.getInput('A')?.connection?.connect(num1.outputConnection!);
    add.getInput('B')?.connection?.connect(num2.outputConnection!);

    const fwd = workspace.newBlock(BLOCK_TYPES.MOTION_FORWARD);
    fwd.getInput('STEPS')?.connection?.connect(add.outputConnection!);

    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    start.nextConnection?.connect(fwd.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('__robot__.maju(((10 + 5)))');
  });

  it('harus mengenerate operator logika & perbandingan: compare, and, or, not', () => {
    const cmp = workspace.newBlock(BLOCK_TYPES.OPERATOR_COMPARE);
    cmp.setFieldValue('>', 'OP');
    const n1 = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    n1.setFieldValue('7', 'NUM');
    const n2 = workspace.newBlock(BLOCK_TYPES.OPERATOR_NUMBER);
    n2.setFieldValue('3', 'NUM');
    cmp.getInput('A')?.connection?.connect(n1.outputConnection!);
    cmp.getInput('B')?.connection?.connect(n2.outputConnection!);

    const notBlock = workspace.newBlock(BLOCK_TYPES.OPERATOR_NOT);
    notBlock.getInput('VALUE')?.connection?.connect(cmp.outputConnection!);

    const ifBlock = workspace.newBlock(BLOCK_TYPES.CONTROL_IF);
    ifBlock.getInput('CONDITION')?.connection?.connect(notBlock.outputConnection!);

    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    start.nextConnection?.connect(ifBlock.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('!((7 > 3))');
  });

  it('harus mengenerate sensor obstacle dalam blok kondisi', () => {
    const ifBlock = workspace.newBlock(BLOCK_TYPES.CONTROL_IF);
    const sensor = workspace.newBlock(BLOCK_TYPES.SENSOR_OBSTACLE);
    ifBlock.getInput('CONDITION')?.connection?.connect(sensor.outputConnection!);

    const stop = workspace.newBlock(BLOCK_TYPES.MOTION_STOP);
    ifBlock.getInput('DO')?.connection?.connect(stop.previousConnection!);

    const start = workspace.newBlock(BLOCK_TYPES.EVENT_START);
    start.nextConnection?.connect(ifBlock.previousConnection!);

    const result = generateProgramCode(workspace);
    expect(result.code).toContain('if (__robot__.cekRintangan())');
    expect(result.code).toContain('await __robot__.berhenti()');
  });
});
