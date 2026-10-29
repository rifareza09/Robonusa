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
import ProgramWorker from './programWorker?worker&inline';

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
  private mainThreadCancel = false;

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

    this.isRunning = true;
    this.mainThreadCancel = false;
    this.statusCallback('running');

    try {
      // Coba jalankan via Web Worker terlebih dahulu
      await this.runInWorker(code);
    } catch (workerErr) {
      // Jika pembuatan Web Worker diblokir oleh browser (CORS, file protocol, iframe CSP)
      console.warn('[RoboKreasi Runtime] Eksekusi Worker dialihkan ke runner sandbox thread utama:', workerErr);
      try {
        await this.runInMainThread(code);
      } catch (mainErr) {
        if (mainErr instanceof Error && mainErr.message === '__PROGRAM_CANCELLED__') {
          this.statusCallback('stopped');
        } else {
          const msg = mainErr instanceof Error ? mainErr.message : 'Error tidak diketahui';
          this.statusCallback('error', this.translateError(msg));
        }
      }
    } finally {
      this.isRunning = false;
    }
  }

  /** Menghentikan program yang sedang berjalan */
  stop() {
    this.mainThreadCancel = true;
    if (this.worker) {
      const msg: WorkerInMessage = { type: 'STOP' };
      this.worker.postMessage(msg);
      setTimeout(() => {
        this.worker?.terminate();
        this.worker = null;
      }, 200);
    }
    this.isRunning = false;
    this.statusCallback('stopped');
  }

  /** Fallback sandbox yang aman dieksekusi di thread utama jika Worker diblokir browser */
  private async runInMainThread(code: string): Promise<void> {
    if (!this.robotAPI) return;
    const api = this.robotAPI;
    const config = this.config;

    const checkCancelled = () => {
      if (this.mainThreadCancel) {
        throw new Error('__PROGRAM_CANCELLED__');
      }
    };

    const robotProxy = {
      maju: async (langkah: number) => {
        checkCancelled();
        return api.maju(langkah);
      },
      mundur: async (langkah: number) => {
        checkCancelled();
        return api.mundur(langkah);
      },
      belokKiri: async (derajat: number) => {
        checkCancelled();
        return api.belokKiri(derajat);
      },
      belokKanan: async (derajat: number) => {
        checkCancelled();
        return api.belokKanan(derajat);
      },
      berhenti: async () => {
        checkCancelled();
        return api.berhenti();
      },
      aturKecepatan: (kecepatan: number) => {
        api.aturKecepatan(kecepatan);
      },
      cekRintangan: () => api.cekRintangan(),
      cekGaris: () => api.cekGaris(),
      tampilkanTeks: (teks: string) => {
        api.tampilkanTeks(teks);
      },
      mainkanNada: async (nada: string, durasi: number) => {
        checkCancelled();
        return api.mainkanNada(nada, durasi);
      },
      hentikanSuara: () => {
        api.hentikanSuara();
      },
      daftarkanKeyHandler: (key: string, handler: () => void) => {
        api.daftarkanKeyHandler?.(key, handler);
      },
      cekDibatalkan: checkCancelled,
      tidur: (ms: number): Promise<void> => {
        return new Promise((res, rej) => {
          const start = Date.now();
          const check = () => {
            if (this.mainThreadCancel) return rej(new Error('__PROGRAM_CANCELLED__'));
            if (Date.now() - start >= ms) return res();
            setTimeout(check, 16);
          };
          check();
        });
      },
    };

    const safeScope = {
      __robot__: robotProxy,
      __config__: config,
      __vars__: {} as Record<string, unknown>,
      __iterasi__: 0,
      __maxIterasi__: config.maxIterations,
      Math,
      String,
      Number,
      Boolean,
      Array,
      Object,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      console: {
        log: (...args: unknown[]) => console.log('[Robot]', ...args),
      },
      window: undefined,
      document: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
      localStorage: undefined,
      sessionStorage: undefined,
      indexedDB: undefined,
      alert: undefined,
      confirm: undefined,
      prompt: undefined,
    };

    const paramNames = Object.keys(safeScope);
    const paramValues = Object.values(safeScope);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as FunctionConstructor;
    const fn = new AsyncFunction(...paramNames, `"use strict";\n${code}`);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, rej) => {
      timeoutId = setTimeout(() => {
        this.mainThreadCancel = true;
        rej(new Error(`Program melebihi batas waktu ${config.maxDurationMs / 1000} detik.`));
      }, config.maxDurationMs);
    });

    try {
      await Promise.race([fn(...paramValues), timeoutPromise]);
      if (!this.mainThreadCancel) {
        this.statusCallback('finished');
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  /** Menjalankan kode di Web Worker */
  private runInWorker(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Buat worker baru menggunakan constructor inlined atau Blob URL fallback
      try {
        try {
          this.worker = new ProgramWorker();
        } catch {
          // Bypasses cross-origin dev server mismatch (misal: robonusa.test vs localhost:5173)
          const workerUrl = new URL('./programWorker.ts', import.meta.url).href;
          const blobCode = `import "${workerUrl}";`;
          const blob = new Blob([blobCode], { type: 'application/javascript' });
          const blobUrl = URL.createObjectURL(blob);
          this.worker = new Worker(blobUrl, { type: 'module' });
        }
      } catch (err) {
        reject(err);
        return;
      }

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

