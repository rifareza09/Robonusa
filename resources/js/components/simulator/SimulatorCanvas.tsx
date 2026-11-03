/**
 * RoboKreasi — Komponen SVG Simulator Robot
 * Mengacu pada desain Figma: "Ruang pemrograman • Desktop terang.png" & "Kit desain • RoboNusa.png"
 */

import React, { useRef } from 'react';
import type { SimulatorState, ProgramStatus, ArenaMode } from '../../types/robokreasi';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SimulatorCanvasProps {
  state: SimulatorState;
  programStatus: ProgramStatus;
  width?: number;
  height?: number;
  arenaMode?: ArenaMode;
  onArenaModeChange?: (mode: ArenaMode) => void;
  onRun?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onCostumeChange?: (costume: NonNullable<SimulatorState['robot']['costume']>) => void;
  onSizeChange?: (size: number) => void;
}

// ─── Warna Figma ──────────────────────────────────────────────────────────────

const COLORS = {
  ARENA_BG: '#FFFFFF',
  ARENA_BORDER: '#E2E8F0',
  ROBOT_BODY: '#37BD71',
  ROBOT_BODY_MOVING: '#2CA360',
  ROBOT_DIRECTION: '#FFFFFF',
  ROBOT_ERROR: '#EF4444',
  OBSTACLE: '#FFF7ED',
  OBSTACLE_BORDER: '#EA580C',
  LINE: '#1E293B',
  DISPLAY_TEXT_BG: 'rgba(55, 189, 113, 0.95)',
} as const;

const COSTUME_MAP: Record<string, string> = {
  default: '/images/robot/pose_default.png',
  walk_right: '/images/robot/pose_walk_right.png',
  walk_left: '/images/robot/pose_walk_left.png',
  mouth_open: '/images/robot/pose_mouth_open.png',
  active: '/images/robot/pose_active.png',
};

const COSTUME_OPTIONS: Array<{
  id: NonNullable<SimulatorState['robot']['costume']>;
  label: string;
  desc: string;
  src: string;
}> = [
  { id: 'default', label: 'Berdiri', desc: 'Pose tegak santai', src: '/images/robot/pose_default.png' },
  { id: 'walk_right', label: 'Kanan', desc: 'Melangkah ke kanan', src: '/images/robot/pose_walk_right.png' },
  { id: 'walk_left', label: 'Kiri', desc: 'Melangkah ke kiri', src: '/images/robot/pose_walk_left.png' },
  { id: 'mouth_open', label: 'Buka Mulut', desc: 'Pose kaget mulut terbuka', src: '/images/robot/pose_mouth_open.png' },
  { id: 'active', label: 'Lompat', desc: 'Pose aktif lompat ceria', src: '/images/robot/pose_active.png' },
];

// ─── Komponen Robot ───────────────────────────────────────────────────────────

const Robot: React.FC<{
  x: number;
  y: number;
  angle: number;
  isMoving: boolean;
  status: ProgramStatus;
  costume?: string;
  size?: number;
  onRobotClick?: () => void;
}> = ({ x, y, angle, isMoving, status, costume = 'default', size = 100, onRobotClick }) => {
  const currentCostume = COSTUME_MAP[costume] ? costume : 'default';
  const spriteSrc = COSTUME_MAP[currentCostume] || COSTUME_MAP.default;

  // Ukuran dasar di kanvas dikalikan skala persentase
  const baseWidth = 54;
  const baseHeight = 58;
  const scaleFactor = Math.max(0.3, Math.min(2.5, size / 100));
  const spriteWidth = baseWidth * scaleFactor;
  const spriteHeight = baseHeight * scaleFactor;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onRobotClick}
      className="cursor-pointer group select-none"
      role="button"
      tabIndex={0}
    >
      <title>Klik karakter robot untuk menjalankan program!</title>
      {/* Bayangan halus robot di kanvas */}
      <ellipse
        cx={0}
        cy={spriteHeight / 2 - 2}
        rx={spriteWidth / 2.6}
        ry={Math.max(3, 6 * scaleFactor)}
        fill="rgba(0, 0, 0, 0.12)"
      />

      {/* Badan robot dapat berputar sesuai orientasi (angle) */}
      <g
        transform={`rotate(${angle})`}
        style={{
          transition: isMoving ? 'transform 0.08s linear' : 'transform 0.2s ease-out',
          transformOrigin: '0px 0px',
        }}
      >
        {/* Indikator status visual saat error */}
        {status === 'error' && (
          <circle
            cx={0}
            cy={0}
            r={spriteWidth / 1.6}
            fill="none"
            stroke="#EF4444"
            strokeWidth={3}
            strokeDasharray="4,3"
            className="animate-pulse"
          />
        )}

        {/* Efek visual glow saat robot bergerak */}
        {isMoving && (
          <circle
            cx={0}
            cy={0}
            r={spriteWidth / 1.6}
            fill="none"
            stroke="#10B981"
            strokeWidth={2}
            opacity={0.6}
          />
        )}

        {/* Karakter Robot (Pose aktif sesuai kostum) */}
        <image
          href={spriteSrc}
          x={-spriteWidth / 2}
          y={-spriteHeight / 2}
          width={spriteWidth}
          height={spriteHeight}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Indikator Titik Sensor Depan (Ujung Antena) */}
        <circle
          cx={0}
          cy={-spriteHeight / 2 + 2}
          r={Math.max(2, 3 * scaleFactor)}
          fill={isMoving ? '#10B981' : '#6366F1'}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      </g>
    </g>
  );
};

// ─── Komponen Rintangan Figma ─────────────────────────────────────────────────

const ObstacleBlock: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
}> = ({ x, y, width, height }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={8}
      fill="#FFF7ED"
      stroke="#EA580C"
      strokeWidth={2}
    />
    {/* Tanda silang X sesuai Figma */}
    <path
      d={`M ${x + 12} ${y + 12} L ${x + width - 12} ${y + height - 12} M ${x + width - 12} ${y + 12} L ${x + 12} ${y + height - 12}`}
      stroke="#EA580C"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <text
      x={x + width + 8}
      y={y + height / 2 + 4}
      fontSize={11}
      fontWeight="600"
      fill="#9A3412"
    >
      Rintangan
    </text>
  </g>
);

// ─── Komponen Utama Simulator ─────────────────────────────────────────────────

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  state,
  programStatus,
  width = 500,
  height = 400,
  arenaMode = 'empty',
  onArenaModeChange,
  onRun,
  onStop,
  onReset,
  onCostumeChange,
  onSizeChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isRunning = programStatus === 'running';

  // Menentukan arah mata angin
  const getCompassDirection = (deg: number): string => {
    const normalized = ((deg % 360) + 360) % 360;
    if (normalized >= 315 || normalized < 45) return 'Utara ↑';
    if (normalized >= 45 && normalized < 135) return 'Timur →';
    if (normalized >= 135 && normalized < 225) return 'Selatan ↓';
    return 'Barat ←';
  };

  const statusBannerConfig: Record<ProgramStatus, { bg: string; border: string; text: string; icon: string; title: string; desc: string }> = {
    idle: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: '▶',
      title: 'Siap',
      desc: 'Program belum dijalankan',
    },
    running: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: '▶',
      title: 'Berjalan',
      desc: 'Robot sedang bergerak mengeksekusi instruksi',
    },
    stopped: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '⏹',
      title: 'Dihentikan',
      desc: 'Program dihentikan oleh pengguna',
    },
    finished: {
      bg: 'bg-green-50/70',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: '✅',
      title: 'Selesai',
      desc: 'Program selesai dieksekusi dengan sukses',
    },
    error: {
      bg: 'bg-red-50/70',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '⚠️',
      title: 'Kesalahan',
      desc: state.errorMessage || 'Terjadi kesalahan saat eksekusi',
    },
  };

  const banner = statusBannerConfig[programStatus] || statusBannerConfig.idle;

  return (
    <div
      id="robot-simulator"
      className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-left text-gray-800"
    >
      {/* ─── Header Simulator Figma ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-900">🤖 Simulator Robot</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200/60 text-gray-600 font-medium">
            Virtual
          </span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {/* Label Kanvas */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span className="font-bold text-gray-700">
            {arenaMode === 'empty'
              ? 'Kanvas Kreasi'
              : arenaMode === 'obstacles'
                ? 'Arena Rintangan'
                : 'Arena Garis'}
          </span>
          <span className="text-[11px] text-[#1E7341] font-bold bg-[#E8F8F0] px-2.5 py-0.5 rounded-full border border-[#37BD71]/30">
            Kanvas Original
          </span>
        </div>

        {/* ─── Kanvas SVG Arena (Original Bersih Tanpa Garis Petak) ──────── */}
        <div
          className="relative w-full bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xs flex-shrink-0"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full block bg-white"
            aria-label="Kanvas Robot"
          >
            {/* Latar Putih Bersih (Original Kanvas) */}
            <rect width={width} height={height} fill="#FFFFFF" />

            {/* Garis lintasan sensor (jika ada pada contoh proyek) */}
            {state.arena.lines.map((line) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth={line.width}
                strokeLinecap="round"
              />
            ))}

            {/* Rintangan (jika ada pada contoh proyek) */}
            {state.arena.obstacles.map((obs) => (
              <ObstacleBlock
                key={obs.id}
                x={obs.x}
                y={obs.y}
                width={obs.width}
                height={obs.height}
              />
            ))}

            {/* Karakter Robot */}
            <Robot
              x={state.robot.x}
              y={state.robot.y}
              angle={state.robot.angle}
              isMoving={state.robot.isMoving}
              status={programStatus}
              costume={state.robot.costume}
              size={state.robot.size}
              onRobotClick={onRun}
            />

            {/* Petunjuk Klik Karakter Robot */}
            <g transform={`translate(${width / 2}, ${height - 12})`}>
              <rect
                x={-90}
                y={-9}
                width={180}
                height={18}
                rx={9}
                fill="rgba(232, 248, 240, 0.95)"
                stroke="#37BD71"
                strokeWidth={1}
              />
              <text
                x={0}
                y={3.5}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight="600"
                fill="#1E7341"
                fontFamily="sans-serif"
              >
                ✨ Klik robot untuk menjalankan
              </text>
            </g>

            {/* Display Teks Robot */}
            {state.displayText && (
              <g>
                <rect
                  x={15}
                  y={height - 42}
                  width={width - 30}
                  height={32}
                  rx={8}
                  fill={COLORS.DISPLAY_TEXT_BG}
                  stroke="#0F766E"
                  strokeWidth={1.5}
                />
                <text
                  x={width / 2}
                  y={height - 21}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={13}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {state.displayText.slice(0, 60)}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* ─── Panel Karakter & Panggung Ala PictoBlox (#37BD71) ────────── */}
        <div className="p-2.5 bg-gradient-to-r from-[#E8F8F0]/80 via-slate-50 to-[#E8F8F0]/80 rounded-2xl border border-[#37BD71]/30 flex flex-col gap-2.5 shadow-2xs">
          {/* Baris 1: Dua Kartu PictoBlox (Karakter / Sprite & Panggung / Backdrop) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Kartu Karakter (Sprite Card Ala PictoBlox) */}
            <div className="relative bg-white rounded-xl border-2 border-[#37BD71] p-1.5 flex flex-col items-center justify-between shadow-xs">
              {/* Tombol Aksi Melayang di Sudut Kartu (Ganti Pose & Reset Posisi) */}
              <div className="w-full flex items-center justify-between px-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = COSTUME_OPTIONS.findIndex((c) => c.id === (state.robot.costume || 'default'));
                    const nextIndex = (currentIndex + 1) % COSTUME_OPTIONS.length;
                    onCostumeChange?.(COSTUME_OPTIONS[nextIndex].id);
                  }}
                  className="w-5 h-5 rounded-full bg-[#37BD71] hover:bg-[#2CA360] text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer transition-transform hover:scale-110"
                  title="Ganti pose karakter (Kostum)"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="w-5 h-5 rounded-full bg-[#37BD71] hover:bg-[#2CA360] text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer transition-transform hover:scale-110"
                  title="Kembalikan robot ke titik awal"
                >
                  🔄
                </button>
              </div>

              {/* Gambar Maskot Robot */}
              <div className="py-1">
                <img
                  src={COSTUME_MAP[state.robot.costume || 'default'] || COSTUME_MAP.default}
                  alt="Robot Sprite"
                  className="w-10 h-10 object-contain drop-shadow-xs"
                />
              </div>

              {/* Label Pill Karakter di Bawah Kartu Ala PictoBlox */}
              <div className="w-full py-0.5 bg-[#37BD71] text-white text-[10px] font-extrabold text-center rounded-md truncate px-1">
                Robot RoboNusa
              </div>
            </div>

            {/* Kartu Panggung / Arena (Backdrop Card Ala PictoBlox) */}
            <div
              onClick={() => {
                const nextMode: ArenaMode =
                  arenaMode === 'empty' ? 'lines' : arenaMode === 'lines' ? 'obstacles' : 'empty';
                onArenaModeChange?.(nextMode);
              }}
              className="relative bg-white rounded-xl border-2 border-[#37BD71] p-1.5 flex flex-col items-center justify-between shadow-xs cursor-pointer hover:border-[#2CA360] transition-colors group"
              title="Klik untuk mengganti tema arena (Original / Garis / Rintangan)"
              role="button"
              tabIndex={0}
            >
              <div className="w-full flex items-center justify-between px-0.5">
                <span className="w-5 h-5 rounded-full bg-[#37BD71] text-white flex items-center justify-center text-[10px] shadow-xs">
                  🖼️
                </span>
                <span className="text-[9px] font-bold text-[#1E7341] bg-[#E8F8F0] px-1 rounded">
                  Ganti
                </span>
              </div>

              {/* Ilustrasi Mini Panggung */}
              <div className="py-2 flex items-center justify-center">
                <div className="w-10 h-7 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs">
                  {arenaMode === 'empty' ? '⚪' : arenaMode === 'obstacles' ? '🧱' : '〰️'}
                </div>
              </div>

              {/* Label Pill Panggung di Bawah Kartu Ala PictoBlox */}
              <div className="w-full py-0.5 bg-[#37BD71] text-white text-[10px] font-extrabold text-center rounded-md truncate px-1">
                {arenaMode === 'empty'
                  ? 'Scene 1 • Original'
                  : arenaMode === 'obstacles'
                    ? 'Scene 2 • Rintangan'
                    : 'Scene 3 • Garis'}
              </div>
            </div>
          </div>

          {/* Baris 2: Pemilih Pose Karakter & Kontrol Skala Ukuran */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-[#37BD71]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#37BD71] animate-pulse" />
                  Pose Karakter:
                </span>
                <span className="text-[10px] text-[#1E7341] bg-[#E8F8F0] font-bold px-1.5 py-0.5 rounded border border-[#37BD71]/30">
                  {COSTUME_OPTIONS.find((c) => c.id === (state.robot.costume || 'default'))?.label || 'Berdiri'}
                </span>
              </div>

              {/* Kontrol Ukuran Karakter */}
              <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-white px-2 py-0.5 rounded-lg border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-400">Ukuran:</span>
                <button
                  type="button"
                  onClick={() => onSizeChange?.(Math.max(20, (state.robot.size ?? 100) - 10))}
                  className="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 font-bold leading-none cursor-pointer"
                  title="Perkecil karakter (-10%)"
                >
                  −
                </button>
                <span className="font-bold text-[#1E7341] min-w-[32px] text-center">
                  {state.robot.size ?? 100}%
                </span>
                <button
                  type="button"
                  onClick={() => onSizeChange?.(Math.min(300, (state.robot.size ?? 100) + 10))}
                  className="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 font-bold leading-none cursor-pointer"
                  title="Perbesar karakter (+10%)"
                >
                  +
                </button>
                {(state.robot.size ?? 100) !== 100 && (
                  <button
                    type="button"
                    onClick={() => onSizeChange?.(100)}
                    className="ml-0.5 text-[9px] text-[#37BD71] hover:text-[#2CA360] font-bold underline cursor-pointer"
                    title="Kembalikan ke ukuran normal 100%"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Tombol Thumbnail 5 Pose Karakter */}
            <div className="grid grid-cols-5 gap-1.5">
              {COSTUME_OPTIONS.map((c) => {
                const isActive = (state.robot.costume || 'default') === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onCostumeChange?.(c.id)}
                    title={`${c.label} (${c.desc})`}
                    className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#37BD71] shadow-sm ring-2 ring-[#37BD71]/40 text-[#1E7341] font-bold'
                        : 'bg-white/80 hover:bg-white border-gray-200/80 text-gray-600 hover:border-[#37BD71]/40'
                    }`}
                  >
                    <img
                      src={c.src}
                      alt={c.label}
                      className="w-6 h-6 object-contain drop-shadow-2xs"
                    />
                    <span className="text-[9px] mt-0.5 truncate max-w-full leading-tight">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Tombol Eksekusi Simulator ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={onStop}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-red-500/20 cursor-pointer"
            >
              <span>⏹</span>
              <span>Hentikan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRun}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-[#37BD71] hover:bg-[#2CA360] active:bg-[#1E7341] text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-[#37BD71]/20 cursor-pointer"
            >
              <span>▶</span>
              <span>Jalankan</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <span>🔄</span>
            <span>Atur ulang</span>
          </button>
        </div>

        {/* ─── Status Banner Figma ──────────────────────────────────────── */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 ${banner.bg} ${banner.border}`}>
          <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs flex-shrink-0 font-bold">
            {banner.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-bold ${banner.text}`}>{banner.title}</p>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{banner.desc}</p>
          </div>
        </div>

        {/* ─── Urutan Eksekusi / Catatan Log Figma ───────────────────────── */}
        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 flex flex-col gap-1 text-xs">
          <p className="font-bold text-[11px] text-gray-700 uppercase tracking-wider">
            Urutan eksekusi
          </p>
          <div className="space-y-1 text-gray-600 max-h-24 overflow-y-auto font-mono text-[11px]">
            {state.logs.length === 0 ? (
              <>
                <p>— Belum ada eksekusi</p>
                <p>— Robot berada di titik awal</p>
                <p>— Sensor dibaca saat program berjalan</p>
              </>
            ) : (
              state.logs.slice(-6).map((log, idx) => (
                <p
                  key={idx}
                  className={
                    log.level === 'error'
                      ? 'text-red-600 font-bold'
                      : log.level === 'warn'
                        ? 'text-amber-600 font-bold'
                        : 'text-gray-700'
                  }
                >
                  <span className="text-gray-400 select-none mr-1">—</span>
                  <span>{log.message}</span>
                </p>
              ))
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1 border-t border-gray-200/60 pt-1">
            Tekan Jalankan untuk mencoba program dari titik awal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulatorCanvas;
