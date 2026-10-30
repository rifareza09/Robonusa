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
}

// ─── Warna Figma ──────────────────────────────────────────────────────────────

const COLORS = {
  ARENA_BG: '#F8FAFC',
  ARENA_BORDER: '#E2E8F0',
  ROBOT_BODY: '#2563EB',
  ROBOT_BODY_MOVING: '#16A34A',
  ROBOT_DIRECTION: '#FFFFFF',
  ROBOT_ERROR: '#DC2626',
  OBSTACLE: '#FEF2F2',
  OBSTACLE_BORDER: '#EA580C',
  LINE: '#1E293B',
  DISPLAY_TEXT_BG: 'rgba(37, 99, 235, 0.95)',
} as const;

// ─── Komponen Robot ───────────────────────────────────────────────────────────

const Robot: React.FC<{
  x: number;
  y: number;
  angle: number;
  isMoving: boolean;
  status: ProgramStatus;
}> = ({ x, y, angle, isMoving, status }) => {
  const bodyColor =
    status === 'error'
      ? COLORS.ROBOT_ERROR
      : isMoving
        ? COLORS.ROBOT_BODY_MOVING
        : COLORS.ROBOT_BODY;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Label "Mulai" saat diam di titik awal */}
      <g transform="translate(24, 4)">
        <rect x={0} y={-10} width={42} height={18} rx={6} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth={1} />
        <text x={21} y={3} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#2563EB">
          Mulai
        </text>
      </g>

      <g transform={`rotate(${angle})`}>
        {/* Roda kiri */}
        <rect x={-20} y={-9} width={5} height={18} rx={2} fill="#1E293B" />
        {/* Roda kanan */}
        <rect x={15} y={-9} width={5} height={18} rx={2} fill="#1E293B" />

        {/* Badan Robot berbentuk kotak rounded modern seperti Figma */}
        <rect
          x={-15}
          y={-15}
          width={30}
          height={30}
          rx={8}
          fill={bodyColor}
          stroke="#1E40AF"
          strokeWidth={2}
          style={{ transition: 'transform 0.15s ease' }}
        />

        {/* Layar/Mata Robot */}
        <rect x={-9} y={-10} width={18} height={9} rx={3} fill="#FFFFFF" opacity={0.9} />
        <circle cx={-4} cy={-5.5} r={1.5} fill="#1E40AF" />
        <circle cx={4} cy={-5.5} r={1.5} fill="#1E40AF" />

        {/* Panah Arah Hadap (Utara) */}
        <path d="M 0 10 L 0 1 M -3 5 L 0 0 L 3 5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Sensor Garis / Rintangan di depan */}
        <circle cx={0} cy={-13} r={2.5} fill="#FACC15" />
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
        {/* Label Ukuran Arena */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span className="font-semibold text-gray-700">
            {arenaMode === 'empty'
              ? 'Arena bebas'
              : arenaMode === 'obstacles'
                ? 'Arena rintangan'
                : 'Arena sensor garis'}
          </span>
          <span className="font-mono text-[11px] text-gray-400">120 × 90 cm</span>
        </div>

        {/* ─── Kanvas SVG Arena ────────────────────────────────────────── */}
        <div
          className="relative w-full bg-slate-50 rounded-xl border border-gray-200 overflow-hidden p-1 flex-shrink-0"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full rounded-lg block"
            aria-label="Arena Robot"
          >
            {/* Background */}
            <rect width={width} height={height} fill={COLORS.ARENA_BG} />

            {/* Grid 1 petak = 10 cm */}
            <defs>
              <pattern id="grid10" width={30} height={30} patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth={0.8} />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid10)" />

            {/* Garis lintasan sensor */}
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

            {/* Rintangan */}
            {state.arena.obstacles.map((obs) => (
              <ObstacleBlock
                key={obs.id}
                x={obs.x}
                y={obs.y}
                width={obs.width}
                height={obs.height}
              />
            ))}

            {/* Robot */}
            <Robot
              x={state.robot.x}
              y={state.robot.y}
              angle={state.robot.angle}
              isMoving={state.robot.isMoving}
              status={programStatus}
            />

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
                  stroke="#1D4ED8"
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

            {/* Label Skala Petak */}
            <text x={width - 80} y={height - 10} fontSize={9} fill="#94A3B8" fontFamily="sans-serif">
              1 petak = 10 cm
            </text>
          </svg>
        </div>

        {/* Legend Lintasan */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-gray-400" />
            <span>Ilustratif, bukan jejak</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-blue-600 rounded" />
            <span>Jejak eksekusi</span>
          </span>
        </div>

        {/* ─── Tombol Eksekusi Simulator (Figma) ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={onStop}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-red-500/20"
            >
              <span>⏹</span>
              <span>Hentikan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRun}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shadow-emerald-500/20"
            >
              <span>▶</span>
              <span>Jalankan</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-colors"
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
