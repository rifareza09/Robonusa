/**
 * RoboKreasi TypeScript Contract Types
 * Kontrak data antara frontend Developer A dan backend Developer B
 * Versi: 1.0 — Sesuai KONTRAK INTEGRASI RESMI ROBO KREASI v1
 *
 * CATATAN: File ini adalah kontrak bersama. Jangan ubah tanpa koordinasi tim.
 */

// ─── Kategori Blok (dari database via Inertia props) ─────────────────────────

export interface BlockCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color_hex: string;
  sort_order: number;
}

// ─── Definisi Blok (dari database via Inertia props) ─────────────────────────

export type BlockShape =
  | 'statement'   // blok pernyataan (top+bottom connection)
  | 'value'       // blok nilai/ekspresi (output connection)
  | 'hat'         // blok kejadian (top output only, no top notch)
  | 'cap';        // blok penutup (top connection, no bottom)

export interface BlockDefinition {
  id: number;
  block_category_id: number;
  block_type: string;         // e.g. "motion_forward" — stable identifier
  display_name: string;       // Bahasa Indonesia
  description: string;
  block_shape: BlockShape;
  parameter_schema: Record<string, unknown> | null;
  sort_order: number;
}

// ─── Proyek Contoh (dari database via Inertia props) ─────────────────────────

export type ProjectDifficulty = 'mudah' | 'sedang' | 'sulit';

export interface ExampleProject {
  id: number;
  name: string;
  slug: string;
  description: string;
  difficulty: ProjectDifficulty;
  thumbnail: string | null;
  workspace_json: BlocklyWorkspaceData;  // hasil serialisasi Blockly yang valid
  sort_order: number;
}

// ─── Panduan (dari database via Inertia props) ────────────────────────────────

export interface GuideStep {
  id: number;
  step_number: number;
  title: string;
  instruction: string;
  target_element: string | null;  // CSS selector untuk highlight elemen
}

export interface Guide {
  id: number;
  title: string;
  description: string;
  steps: GuideStep[];
}

// ─── Props Inertia untuk halaman Workspace ────────────────────────────────────

export interface WorkspacePageProps {
  blockCategories: BlockCategory[];
  blockDefinitions: BlockDefinition[];
  exampleProjects: ExampleProject[];
  guides: Guide[];
}

// ─── Format File Proyek Lokal Siswa ──────────────────────────────────────────

export const PROJECT_FORMAT = 'robokreasi-project' as const;
export const PROJECT_VERSION = 1 as const;

export interface LocalProjectFile {
  format: typeof PROJECT_FORMAT;
  version: typeof PROJECT_VERSION;
  projectName: string;
  workspace: BlocklyWorkspaceData;
  savedAt?: string;  // ISO 8601 timestamp
}

// ─── Blockly Workspace Serialization ─────────────────────────────────────────

/**
 * Data serialisasi workspace Blockly (output dari Blockly.serialization.workspaces.save)
 * Struktur internal ditentukan oleh Blockly API versi 13.x
 */
export interface BlocklyWorkspaceData {
  blocks?: {
    languageVersion: number;
    blocks: unknown[];
  };
  variables?: Array<{
    name: string;
    id: string;
  }>;
  [key: string]: unknown;
}

// ─── Nama Jenis Blok yang Disepakati ─────────────────────────────────────────

export const BLOCK_TYPES = {
  // Kejadian
  EVENT_START: 'event_start',
  EVENT_KEY_PRESSED: 'event_key_pressed',

  // Gerakan
  MOTION_FORWARD: 'motion_forward',
  MOTION_BACKWARD: 'motion_backward',
  MOTION_TURN_LEFT: 'motion_turn_left',
  MOTION_TURN_RIGHT: 'motion_turn_right',
  MOTION_STOP: 'motion_stop',
  MOTION_SET_SPEED: 'motion_set_speed',

  // Kontrol
  CONTROL_REPEAT: 'control_repeat',
  CONTROL_FOREVER: 'control_forever',
  CONTROL_IF: 'control_if',
  CONTROL_IF_ELSE: 'control_if_else',

  // Operator
  OPERATOR_ADD: 'operator_add',
  OPERATOR_SUBTRACT: 'operator_subtract',
  OPERATOR_COMPARE: 'operator_compare',
  OPERATOR_AND: 'operator_and',
  OPERATOR_OR: 'operator_or',
  OPERATOR_NOT: 'operator_not',
  OPERATOR_NUMBER: 'operator_number',

  // Variabel
  VARIABLE_SET: 'variable_set',
  VARIABLE_CHANGE: 'variable_change',
  VARIABLE_GET: 'variable_get',

  // Sensor
  SENSOR_OBSTACLE: 'sensor_obstacle',
  SENSOR_LINE: 'sensor_line',

  // Tampilan
  DISPLAY_TEXT: 'display_text',

  // Suara
  SOUND_PLAY_TONE: 'sound_play_tone',
  SOUND_STOP: 'sound_stop',
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];

// ─── Status Program ───────────────────────────────────────────────────────────

export type ProgramStatus = 'idle' | 'running' | 'stopped' | 'error' | 'finished';

// ─── Simulator State ──────────────────────────────────────────────────────────

export interface RobotState {
  x: number;          // posisi X di arena (pixels)
  y: number;          // posisi Y di arena (pixels)
  angle: number;      // arah hadap dalam derajat (0 = atas, searah jarum jam)
  speed: number;      // kecepatan (1-10)
  isMoving: boolean;
}

export interface ArenaState {
  width: number;
  height: number;
  obstacles: Obstacle[];
  lines: Line[];
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
}

export interface SimulatorState {
  robot: RobotState;
  arena: ArenaState;
  displayText: string;
  programStatus: ProgramStatus;
  errorMessage: string | null;
  logs: SimulatorLog[];
}

export interface SimulatorLog {
  timestamp: number;
  message: string;
  level: 'info' | 'warn' | 'error';
}

// ─── API Simulator (kontrak antara runtime dan simulator) ─────────────────────

export interface SimulatorAPI {
  // Gerakan
  maju(langkah: number): Promise<void>;
  mundur(langkah: number): Promise<void>;
  belokKiri(derajat: number): Promise<void>;
  belokKanan(derajat: number): Promise<void>;
  berhenti(): Promise<void>;
  aturKecepatan(kecepatan: number): void;

  // Sensor (mengembalikan nilai berdasarkan kondisi arena nyata)
  cekRintangan(): boolean;
  cekGaris(): boolean;

  // Tampilan
  tampilkanTeks(teks: string): void;

  // Suara
  mainkanNada(nada: string, durasi: number): Promise<void>;
  hentikanSuara(): void;

  // Utilitas runtime
  tidur(ms: number): Promise<void>;
  cekDibatalkan(): void;  // melempar error jika program dihentikan
}

// ─── Pesan antara Main Thread dan Worker ─────────────────────────────────────

export type WorkerInMessage =
  | { type: 'RUN'; code: string; config: RuntimeConfig }
  | { type: 'STOP' };

export type WorkerOutMessage =
  | { type: 'API_CALL'; id: number; method: string; args: unknown[] }
  | { type: 'FINISHED' }
  | { type: 'ERROR'; message: string }
  | { type: 'LOG'; message: string; level: 'info' | 'warn' | 'error' };

export type MainToWorkerReply =
  | { type: 'API_RESULT'; id: number; result: unknown }
  | { type: 'API_ERROR'; id: number; error: string };

export interface RuntimeConfig {
  maxIterations: number;
  maxDurationMs: number;
  stepDelayMs: number;
}

