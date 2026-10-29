/**
 * RoboKreasi — Logika Simulasi Robot
 * Menghitung posisi, gerakan, dan pembacaan sensor secara fisik.
 * Terpisah dari rendering UI agar tetap responsif.
 *
 * Satuan: pixel (1 langkah = PIXELS_PER_STEP pixel)
 */

import type { RobotState, ArenaState, Obstacle, SimulatorLog } from '../../types/robokreasi';

// ─── Konstanta Fisika ─────────────────────────────────────────────────────────

const PIXELS_PER_STEP = 20;        // 1 langkah = 20px
const ROBOT_RADIUS = 20;           // radius robot dalam pixel
const OBSTACLE_DETECTION_DIST = 40; // jarak deteksi rintangan (px)
const LINE_DETECTION_RADIUS = 8;   // radius sensor garis (px)
const BASE_ANIMATION_MS = 300;     // durasi animasi dasar per langkah pada speed=5

// ─── Tipe ─────────────────────────────────────────────────────────────────────

export interface SimulationState {
  robot: RobotState;
  arena: ArenaState;
  displayText: string;
  logs: SimulatorLog[];
  errorMessage: string | null;
}

export type StateUpdateCallback = (state: SimulationState) => void;

// ─── Arah Robot ──────────────────────────────────────────────────────────────

/** Mengkonversi sudut (0=atas, searah jarum jam) ke vektor unit */
function angleToVector(angleDeg: number): { dx: number; dy: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    dx: Math.sin(rad),
    dy: -Math.cos(rad),  // Y-axis terbalik di canvas
  };
}

// ─── Deteksi Rintangan ───────────────────────────────────────────────────────

function isPointInObstacle(x: number, y: number, obstacle: Obstacle): boolean {
  return (
    x >= obstacle.x &&
    x <= obstacle.x + obstacle.width &&
    y >= obstacle.y &&
    y <= obstacle.y + obstacle.height
  );
}

function isRobotCollidingWithObstacle(
  robotX: number,
  robotY: number,
  obstacle: Obstacle
): boolean {
  // Cek apakah lingkaran robot bersinggungan dengan persegi rintangan
  const closestX = Math.max(obstacle.x, Math.min(robotX, obstacle.x + obstacle.width));
  const closestY = Math.max(obstacle.y, Math.min(robotY, obstacle.y + obstacle.height));
  const distX = robotX - closestX;
  const distY = robotY - closestY;
  return Math.sqrt(distX * distX + distY * distY) < ROBOT_RADIUS;
}

function hasObstacleAhead(robot: RobotState, arena: ArenaState): boolean {
  const { dx, dy } = angleToVector(robot.angle);
  // Cek titik di depan robot sejauh OBSTACLE_DETECTION_DIST
  const checkX = robot.x + dx * (ROBOT_RADIUS + OBSTACLE_DETECTION_DIST);
  const checkY = robot.y + dy * (ROBOT_RADIUS + OBSTACLE_DETECTION_DIST);

  // Cek dinding arena
  if (
    checkX < ROBOT_RADIUS ||
    checkX > arena.width - ROBOT_RADIUS ||
    checkY < ROBOT_RADIUS ||
    checkY > arena.height - ROBOT_RADIUS
  ) {
    return true;
  }

  // Cek rintangan
  for (const obstacle of arena.obstacles) {
    if (isPointInObstacle(checkX, checkY, obstacle)) {
      return true;
    }
  }

  return false;
}

// ─── Deteksi Garis ───────────────────────────────────────────────────────────

function distancePointToSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projX = ax + t * dx;
  const projY = ay + t * dy;
  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
}

function isRobotOnLine(robot: RobotState, arena: ArenaState): boolean {
  for (const line of arena.lines) {
    const dist = distancePointToSegment(robot.x, robot.y, line.x1, line.y1, line.x2, line.y2);
    if (dist <= LINE_DETECTION_RADIUS + line.width / 2) {
      return true;
    }
  }
  return false;
}

// ─── Kelas Simulator ─────────────────────────────────────────────────────────

export class RobotSimulator {
  private state: SimulationState;
  private onUpdate: StateUpdateCallback;
  private audioContext: AudioContext | null = null;

  constructor(
    initialArena: ArenaState,
    onUpdate: StateUpdateCallback
  ) {
    this.onUpdate = onUpdate;
    this.state = {
      robot: {
        x: initialArena.width / 2,
        y: initialArena.height / 2,
        angle: 0,
        speed: 5,
        isMoving: false,
      },
      arena: initialArena,
      displayText: '',
      logs: [],
      errorMessage: null,
    };
  }

  /** Mendapatkan state saat ini (readonly) */
  getState(): Readonly<SimulationState> {
    return this.state;
  }

  /** Reset posisi robot dan state simulator */
  reset() {
    this.state = {
      ...this.state,
      robot: {
        x: this.state.arena.width / 2,
        y: this.state.arena.height / 2,
        angle: 0,
        speed: 5,
        isMoving: false,
      },
      displayText: '',
      logs: [],
      errorMessage: null,
    };
    this.emitUpdate();
  }

  /** Memperbarui arena (dari props backend) */
  setArena(arena: ArenaState) {
    this.state = { ...this.state, arena };
    this.emitUpdate();
  }

  // ─── Implementasi SimulatorAPI ──────────────────────────────────────────

  async maju(langkah: number): Promise<void> {
    const steps = Math.max(0, Math.min(langkah, 100)); // Batasi 0-100
    const { dx, dy } = angleToVector(this.state.robot.angle);
    const totalDist = steps * PIXELS_PER_STEP;

    // Cek dinding dan rintangan
    const newX = this.state.robot.x + dx * totalDist;
    const newY = this.state.robot.y + dy * totalDist;

    const clampedX = Math.max(ROBOT_RADIUS, Math.min(this.state.arena.width - ROBOT_RADIUS, newX));
    const clampedY = Math.max(ROBOT_RADIUS, Math.min(this.state.arena.height - ROBOT_RADIUS, newY));

    // Cek tabrakan dengan rintangan
    let finalX = clampedX;
    let finalY = clampedY;

    for (const obstacle of this.state.arena.obstacles) {
      if (isRobotCollidingWithObstacle(clampedX, clampedY, obstacle)) {
        // Kembali ke posisi sebelum tabrakan
        finalX = this.state.robot.x;
        finalY = this.state.robot.y;
        this.addLog('⚠️ Robot menabrak rintangan!', 'warn');
        break;
      }
    }

    this.state = {
      ...this.state,
      robot: { ...this.state.robot, x: finalX, y: finalY, isMoving: true },
    };
    this.emitUpdate();

    // Animasi — tunggu sesuai kecepatan
    await this.sleep(this.getStepDuration(steps));

    this.state = { ...this.state, robot: { ...this.state.robot, isMoving: false } };
    this.emitUpdate();
  }

  async mundur(langkah: number): Promise<void> {
    const steps = Math.max(0, Math.min(langkah, 100));
    const { dx, dy } = angleToVector(this.state.robot.angle);
    const totalDist = steps * PIXELS_PER_STEP;

    const newX = this.state.robot.x - dx * totalDist;
    const newY = this.state.robot.y - dy * totalDist;

    const clampedX = Math.max(ROBOT_RADIUS, Math.min(this.state.arena.width - ROBOT_RADIUS, newX));
    const clampedY = Math.max(ROBOT_RADIUS, Math.min(this.state.arena.height - ROBOT_RADIUS, newY));

    let finalX = clampedX;
    let finalY = clampedY;

    for (const obstacle of this.state.arena.obstacles) {
      if (isRobotCollidingWithObstacle(clampedX, clampedY, obstacle)) {
        finalX = this.state.robot.x;
        finalY = this.state.robot.y;
        this.addLog('⚠️ Robot menabrak rintangan!', 'warn');
        break;
      }
    }

    this.state = {
      ...this.state,
      robot: { ...this.state.robot, x: finalX, y: finalY, isMoving: true },
    };
    this.emitUpdate();

    await this.sleep(this.getStepDuration(steps));

    this.state = { ...this.state, robot: { ...this.state.robot, isMoving: false } };
    this.emitUpdate();
  }

  async belokKiri(derajat: number): Promise<void> {
    const deg = Math.max(0, Math.min(derajat, 360));
    const newAngle = ((this.state.robot.angle - deg) + 360) % 360;
    this.state = {
      ...this.state,
      robot: { ...this.state.robot, angle: newAngle },
    };
    this.emitUpdate();
    await this.sleep(150);
  }

  async belokKanan(derajat: number): Promise<void> {
    const deg = Math.max(0, Math.min(derajat, 360));
    const newAngle = (this.state.robot.angle + deg) % 360;
    this.state = {
      ...this.state,
      robot: { ...this.state.robot, angle: newAngle },
    };
    this.emitUpdate();
    await this.sleep(150);
  }

  async berhenti(): Promise<void> {
    this.state = {
      ...this.state,
      robot: { ...this.state.robot, isMoving: false },
    };
    this.emitUpdate();
    await this.sleep(50);
  }

  aturKecepatan(kecepatan: number): void {
    const speed = Math.max(1, Math.min(10, Math.round(kecepatan)));
    this.state = {
      ...this.state,
      robot: { ...this.state.robot, speed },
    };
    this.emitUpdate();
  }

  /** Membaca sensor rintangan berdasarkan kondisi arena nyata */
  cekRintangan(): boolean {
    return hasObstacleAhead(this.state.robot, this.state.arena);
  }

  /** Membaca sensor garis berdasarkan kondisi arena nyata */
  cekGaris(): boolean {
    return isRobotOnLine(this.state.robot, this.state.arena);
  }

  tampilkanTeks(teks: string): void {
    const maxLen = 200;
    const safe = String(teks).slice(0, maxLen);
    this.state = { ...this.state, displayText: safe };
    this.addLog(`💬 ${safe}`, 'info');
    this.emitUpdate();
  }

  async mainkanNada(nada: string, durasi: number): Promise<void> {
    const freq = NOTE_FREQUENCIES[nada] ?? 440;
    const clampedDuration = Math.max(100, Math.min(durasi, 5000));

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
      const ctx = this.audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + clampedDuration / 1000);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + clampedDuration / 1000);
      this.addLog(`🔔 Memainkan nada ${nada} (${freq}Hz, ${clampedDuration}ms)`, 'info');
    } catch {
      this.addLog('⚠️ Tidak dapat memutar suara', 'warn');
    }

    await this.sleep(clampedDuration);
  }

  hentikanSuara(): void {
    if (this.audioContext) {
      this.audioContext.close().catch(() => null);
      this.audioContext = null;
    }
    this.addLog('🔇 Suara dihentikan', 'info');
  }

  /** Digunakan oleh runtime — bukan bagian dari SimulatorAPI */
  async tidur(ms: number): Promise<void> {
    return this.sleep(ms);
  }

  cekDibatalkan(): void {
    // Implementasi di runtime level, bukan di simulator
    // Dilempar oleh Worker — simulator hanya perlu ada metode ini
  }

  // ─── Utilitas Internal ───────────────────────────────────────────────────

  private emitUpdate() {
    // Kirim snapshot state yang immutable
    this.onUpdate({ ...this.state });
  }

  private addLog(message: string, level: 'info' | 'warn' | 'error') {
    const log = { timestamp: Date.now(), message, level };
    this.state = {
      ...this.state,
      logs: [...this.state.logs.slice(-99), log], // Simpan max 100 log
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getStepDuration(steps: number): number {
    // Kecepatan 1 = lambat (600ms/step), 10 = cepat (60ms/step)
    const msPerStep = BASE_ANIMATION_MS * (6 / this.state.robot.speed);
    return steps * msPerStep;
  }
}

// ─── Frekuensi Not Musik ──────────────────────────────────────────────────────

const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
};

// ─── Arena Default ────────────────────────────────────────────────────────────

export function createDefaultArena(width = 500, height = 400): ArenaState {
  return {
    width,
    height,
    obstacles: [
      { id: 'obs1', x: 80, y: 80, width: 60, height: 60 },
      { id: 'obs2', x: 360, y: 260, width: 60, height: 60 },
      { id: 'obs3', x: 200, y: 150, width: 40, height: 40 },
    ],
    lines: [
      // Garis tengah horizontal
      { id: 'line1', x1: 50, y1: 200, x2: 450, y2: 200, color: '#000000', width: 6 },
      // Garis vertikal kecil
      { id: 'line2', x1: 250, y1: 200, x2: 250, y2: 350, color: '#000000', width: 6 },
    ],
  };
}

