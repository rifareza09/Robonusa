/**
 * RoboKreasi — Runtime Controller
 * Mengelola siklus hidup eksekusi program:
 * - Validasi sebelum run
 * - Komunikasi dengan Web Worker
 * - Bridging API robot dari Worker ke Simulator
 * - Penanganan error dalam Bahasa Indonesia
 */

import type {
  SimulatorAPI,
  ProgramStatus,
  WorkerInMessage,
  WorkerOutMessage,
  MainToWorkerReply,
  RuntimeConfig,
} from '../types/robokreasi';
import { BLOCK_TYPES } from '../types/robokreasi';

// ─── Konfigurasi default runtime ─────────────────────────────────────────────

const DEFAULT_CONFIG: RuntimeConfig = {
  maxIterations: 10_000,
  maxDurationMs: 30_000,   // 30 detik maksimum
  stepDelayMs: 100,         // delay antar langkah robot (ms)
};

// ─── Konstanta validasi ────────────────────────────────────────────────────────

/** Jenis blok yang diizinkan — blok lain akan ditolak */
const ALLOWED_BLOCK_TYPES = new Set<string>(Object.values(BLOCK_TYPES));
ALLOWED_BLOCK_TYPES.add('rk_text');

// ─── Pesan error Bahasa Indonesia ────────────────────────────────────────────

const ERROR_MESSAGES = {
  NO_EVENT_START: '❌ Program harus dimulai dengan blok "Saat Mulai Diklik".',
  WORKER_NOT_SUPPORTED: '❌ Browser kamu tidak mendukung Web Worker. Gunakan browser yang lebih baru.',
  MAX_ITERATIONS: '⚠️ Program dihentikan: terlalu banyak perulangan. Periksa loop "Selamanya" atau "Ulangi" kamu.',
  TIMEOUT: '⚠️ Program dihentikan: waktu eksekusi terlalu lama.',
  ROBOT_OUT_OF_BOUNDS: '⚠️ Robot keluar dari arena! Program dihentikan.',
  unknownBlock: (type: string) => `❌ Blok tidak dikenal ditemukan: "${type}". Hapus blok tersebut dan coba lagi.`,
} as const;

// ─── Validator Program ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProgram(
  topBlocks: string[],
  allBlockTypes: string[]
): ValidationResult {
  const errors: string[] = [];

  // Cek blok event_start
  if (!topBlocks.includes(BLOCK_TYPES.EVENT_START)) {
    errors.push(ERROR_MESSAGES.NO_EVENT_START);
  }

  // Cek blok yang tidak dikenal
  for (const blockType of allBlockTypes) {
    if (!ALLOWED_BLOCK_TYPES.has(blockType)) {
      errors.push(ERROR_MESSAGES.unknownBlock(blockType));
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Runtime Controller ───────────────────────────────────────────────────────

export type StatusCallback = (status: ProgramStatus, message?: string) => void;

export class ProgramRuntime {
  private worker: Worker | null = null;
  private robotAPI: SimulatorAPI | null = null;
  private statusCallback: StatusCallback;
  private config: RuntimeConfig;
  private isRunning = false;

  constructor(
    statusCallback: StatusCallback,
    config: Partial<RuntimeConfig> = {}
  ) {
    this.statusCallback = statusCallback;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Menghubungkan runtime dengan implementasi API simulator */
  connectSimulator(api: SimulatorAPI) {
    this.robotAPI = api;
  }

  /** Apakah program sedang berjalan */
  get running() {
    return this.isRunning;
  }

  /** Menjalankan program */
  async run(code: string, topBlocks: string[], allBlockTypes: string[]): Promise<void> {
    if (this.isRunning) {
      console.warn('[RoboKreasi Runtime] Program sudah berjalan');
      return;
    }

    // Validasi
    const validation = validateProgram(topBlocks, allBlockTypes);
    if (!validation.valid) {
      this.statusCallback('error', validation.errors.join('\n'));
      return;
    }

    if (!this.robotAPI) {
      this.statusCallback('error', '❌ Simulator belum terhubung.');
      return;
    }

    // Cek Web Worker support
    if (typeof Worker === 'undefined') {
      this.statusCallback('error', ERROR_MESSAGES.WORKER_NOT_SUPPORTED);
      return;
    }

    this.isRunning = true;
    this.statusCallback('running');

    try {
      await this.runInWorker(code);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error tidak diketahui';
      this.statusCallback('error', msg);
    } finally {
      this.isRunning = false;
    }
  }

  /** Menghentikan program yang sedang berjalan */
  stop() {
    if (this.worker) {
      const msg: WorkerInMessage = { type: 'STOP' };
      this.worker.postMessage(msg);
      // Matikan worker setelah delay singkat
      setTimeout(() => {
        this.worker?.terminate();
        this.worker = null;
      }, 200);
    }
    this.isRunning = false;
    this.statusCallback('stopped');
  }

  /** Menjalankan kode di Web Worker */
  private runInWorker(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Buat worker baru dari file yang dikompilasi
      this.worker = new Worker(
        new URL('../lib/programWorker.ts', import.meta.url),
        { type: 'module' }
      );

      // Terima pesan dari worker
      this.worker.addEventListener('message', async (event: MessageEvent<WorkerOutMessage>) => {
        const msg = event.data;

        switch (msg.type) {
          case 'API_CALL':
            await this.handleAPICall(msg.id, msg.method, msg.args as unknown[]);
            break;

          case 'LOG':
            console.log(`[Robot] ${msg.message}`);
            break;

          case 'FINISHED':
            this.worker?.terminate();
            this.worker = null;
            this.isRunning = false;
            this.statusCallback('finished');
            resolve();
            break;

          case 'ERROR': {
            this.worker?.terminate();
            this.worker = null;
            this.isRunning = false;
            // Terjemahkan pesan error ke Bahasa Indonesia
            const translated = this.translateError(msg.message);
            this.statusCallback('error', translated);
            reject(new Error(translated));
            break;
          }
        }
      });

      this.worker.addEventListener('error', (event) => {
        this.worker?.terminate();
        this.worker = null;
        this.isRunning = false;
        const msg = `❌ Kesalahan sistem: ${event.message}`;
        this.statusCallback('error', msg);
        reject(new Error(msg));
      });

      // Kirim kode ke worker
      const msg: WorkerInMessage = {
        type: 'RUN',
        code,
        config: this.config,
      };
      this.worker.postMessage(msg);
    });
  }

  /** Menjalankan API call yang diminta oleh worker */
  private async handleAPICall(id: number, method: string, args: unknown[]): Promise<void> {
    if (!this.robotAPI || !this.worker) return;

    try {
      let result: unknown = undefined;

      // Mapping nama metode ke API simulator
      switch (method) {
        case 'maju':
          await this.robotAPI.maju(args[0] as number);
          break;
        case 'mundur':
          await this.robotAPI.mundur(args[0] as number);
          break;
        case 'belokKiri':
          await this.robotAPI.belokKiri(args[0] as number);
          break;
        case 'belokKanan':
          await this.robotAPI.belokKanan(args[0] as number);
          break;
        case 'berhenti':
          await this.robotAPI.berhenti();
          break;
        case 'aturKecepatan':
          this.robotAPI.aturKecepatan(args[0] as number);
          break;
        case 'tampilkanTeks':
          this.robotAPI.tampilkanTeks(args[0] as string);
          break;
        case 'mainkanNada':
          await this.robotAPI.mainkanNada(args[0] as string, args[1] as number);
          break;
        case 'hentikanSuara':
          this.robotAPI.hentikanSuara();
          break;
        default:
          throw new Error(`Metode tidak dikenal: ${method}`);
      }

      // Kirim hasil ke worker
      const reply: MainToWorkerReply = { type: 'API_RESULT', id, result };
      this.worker.postMessage(reply);
    } catch (err) {
      const reply: MainToWorkerReply = {
        type: 'API_ERROR',
        id,
        error: err instanceof Error ? err.message : 'Error tidak diketahui',
      };
      this.worker?.postMessage(reply);
    }
  }

  /** Menerjemahkan pesan error teknis ke Bahasa Indonesia */
  private translateError(message: string): string {
    if (message.includes('terlalu banyak iterasi') || message.includes('maxIterasi')) {
      return ERROR_MESSAGES.MAX_ITERATIONS;
    }
    if (message.includes('batas waktu') || message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT;
    }
    if (message.includes('keluar dari arena')) {
      return ERROR_MESSAGES.ROBOT_OUT_OF_BOUNDS;
    }
    // Kembalikan pesan asli jika sudah dalam Bahasa Indonesia
    if (message.startsWith('❌') || message.startsWith('⚠️')) {
      return message;
    }
    return `❌ Terjadi kesalahan: ${message}`;
  }
}

