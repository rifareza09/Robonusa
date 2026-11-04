/**
 * RoboKreasi — Komponen Panggung & Simulator Robot
 * Desain bersih, sederhana, dan alami (tanpa shelf yang tidak berguna / AI slop).
 */

import React, { useRef, useState } from 'react';
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

// ─── Konstanta & Pustaka Pose Karakter ────────────────────────────────────────

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
  { id: 'default', label: 'Berdiri', desc: 'Pose santai', src: '/images/robot/pose_default.png' },
  { id: 'walk_right', label: 'Kanan', desc: 'Langkah kanan', src: '/images/robot/pose_walk_right.png' },
  { id: 'walk_left', label: 'Kiri', desc: 'Langkah kiri', src: '/images/robot/pose_walk_left.png' },
  { id: 'mouth_open', label: 'Kaget', desc: 'Mulut terbuka', src: '/images/robot/pose_mouth_open.png' },
  { id: 'active', label: 'Lompat', desc: 'Lompat ceria', src: '/images/robot/pose_active.png' },
];

// ─── Komponen Sprite Robot ───────────────────────────────────────────────────

const RobotSprite: React.FC<{
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

  const baseWidth = 56;
  const baseHeight = 60;
  const scaleFactor = Math.max(0.3, Math.min(2.5, size / 100));
  const spriteWidth = baseWidth * scaleFactor;
  const spriteHeight = baseHeight * scaleFactor;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onRobotClick}
      className="cursor-pointer select-none"
      role="button"
      tabIndex={0}
    >
      <title>Karakter Robot RoboNusa</title>

      {/* Bayangan Karakter di Lantai Panggung */}
      <ellipse
        cx={0}
        cy={spriteHeight / 2 - 2}
        rx={spriteWidth / 2.6}
        ry={Math.max(3, 6 * scaleFactor)}
        fill="rgba(0, 0, 0, 0.12)"
      />

      {/* Badan Karakter (Orientasi rotasi sudut) */}
      <g
        transform={`rotate(${angle})`}
        style={{
          transition: isMoving ? 'transform 0.08s linear' : 'transform 0.2s ease-out',
          transformOrigin: '0px 0px',
        }}
      >
        {status === 'error' && (
          <circle
            cx={0}
            cy={0}
            r={spriteWidth / 1.6}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2.5}
            strokeDasharray="4,3"
          />
        )}

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

        {/* Gambar Karakter Transparan */}
        <image
          href={spriteSrc}
          x={-spriteWidth / 2}
          y={-spriteHeight / 2}
          width={spriteWidth}
          height={spriteHeight}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Titik Sensor Halus pada Antena */}
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

// ─── Komponen Rintangan Arena ─────────────────────────────────────────────────

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
      strokeDasharray="5,4"
    />
    <line
      x1={x + 4}
      y1={y + 4}
      x2={x + width - 4}
      y2={y + height - 4}
      stroke="#FDBA74"
      strokeWidth={1.5}
    />
    <line
      x1={x + width - 4}
      y1={y + 4}
      x2={x + 4}
      y2={y + height - 4}
      stroke="#FDBA74"
      strokeWidth={1.5}
    />
    <text
      x={x + width / 2}
      y={y + height / 2 + 3.5}
      textAnchor="middle"
      fontSize={10}
      fontFamily="sans-serif"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);

  const isRunning = programStatus === 'running';
  const activeCostume = state.robot.costume || 'default';
  const currentSize = state.robot.size ?? 100;

  // Tangkapan layar panggung
  const handleScreenshot = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulator-robonusa-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle layar penuh
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const statusLabel =
    programStatus === 'running'
      ? 'Berjalan'
      : programStatus === 'stopped'
        ? 'Dihentikan'
        : programStatus === 'finished'
          ? 'Selesai'
          : programStatus === 'error'
            ? 'Kesalahan'
            : 'Siap';

  const gridCols = 20;
  const gridRows = 15;
  const colWidth = width / gridCols;
  const rowHeight = height / gridRows;

  return (
    <div
      ref={containerRef}
      id="robot-simulator"
      className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-left select-none shadow-xs"
    >
      {/* ─── Header Simulator ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-gray-800">
            🤖 Simulator Robot
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200/70 text-gray-600 font-medium">
            Virtual
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Label (Diperlukan oleh testing & monitoring) */}
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              programStatus === 'running'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : programStatus === 'error'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* ─── Kanvas Panggung dengan Koordinat Rulers ─────────────────── */}
        <div className="flex flex-col bg-white rounded-xl border border-gray-300 overflow-hidden shadow-2xs">
          <div className="flex">
            {/* Penggaris Sumbu Y Vertikal (15..1) */}
            {showGrid && (
              <div
                className="w-5 flex flex-col justify-between py-1 bg-[#FAFAFA] border-r border-gray-200 text-[9px] font-semibold text-gray-400 text-center select-none"
                style={{ height: '100%' }}
              >
                {Array.from({ length: 15 }, (_, i) => 15 - i).map((num) => (
                  <span key={num} className="leading-none">
                    {num}
                  </span>
                ))}
              </div>
            )}

            {/* Kanvas SVG Panggung */}
            <div
              className="relative flex-1 bg-white overflow-hidden"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full block bg-white"
                aria-label="Panggung Robot"
              >
                {/* Latar Putih Bersih */}
                <rect width={width} height={height} fill="#FFFFFF" />

                {/* Grid Titik Koordinat Halus */}
                {showGrid && (
                  <g opacity={0.35}>
                    {Array.from({ length: gridCols + 1 }).map((_, col) =>
                      Array.from({ length: gridRows + 1 }).map((__, row) => (
                        <circle
                          key={`dot-${col}-${row}`}
                          cx={col * colWidth}
                          cy={row * rowHeight}
                          r={col === 10 ? 1.5 : 1}
                          fill={col === 10 ? '#7C3AED' : '#94A3B8'}
                        />
                      ))
                    )}
                  </g>
                )}

                {/* Garis lintasan sensor arena */}
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

                {/* Rintangan arena */}
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
                <RobotSprite
                  x={state.robot.x}
                  y={state.robot.y}
                  angle={state.robot.angle}
                  isMoving={state.robot.isMoving}
                  status={programStatus}
                  costume={state.robot.costume}
                  size={state.robot.size}
                  onRobotClick={isRunning ? onStop : onRun}
                />

                {/* Teks Display Robot */}
                {state.displayText && (
                  <g>
                    <rect
                      x={15}
                      y={height - 38}
                      width={width - 30}
                      height={28}
                      rx={6}
                      fill="rgba(15, 23, 42, 0.85)"
                    />
                    <text
                      x={width / 2}
                      y={height - 20}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={12}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {state.displayText.slice(0, 60)}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Penggaris Sumbu X Horizontal (0..20) */}
          {showGrid && (
            <div className="flex items-center justify-between px-6 py-0.5 bg-[#FAFAFA] border-t border-gray-200 text-[9px] font-semibold text-gray-400 select-none">
              {Array.from({ length: 21 }, (_, i) => i).map((num) => (
                <span
                  key={num}
                  className={num === 10 ? 'text-purple-700 font-bold' : ''}
                >
                  {num}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── Tombol Kontrol Panggung Alami (Bawah Kanvas) ─────────────── */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Tombol Eksekusi: Bendera Hijau (Jalankan), Hentikan & Atur Ulang */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-run-flag"
              type="button"
              onClick={onRun}
              className={`p-2 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                isRunning
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 scale-105'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95'
              }`}
              title="Jalankan program (Bendera Hijau)"
              aria-label="Bendera hijau"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
              </svg>
            </button>

            {isRunning && (
              <button
                id="btn-stop-program"
                type="button"
                onClick={onStop}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
                title="Hentikan program"
                aria-label="Hentikan program"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            )}

            <button
              id="btn-reset-simulator"
              type="button"
              onClick={onReset}
              className="p-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl shadow-2xs transition-colors flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
              title="Atur ulang posisi robot"
              aria-label="Atur ulang posisi robot"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Tombol Kamera, Grid Toggle, Fullscreen */}
          <div className="flex items-center gap-1 text-gray-500">
            <button
              type="button"
              onClick={handleScreenshot}
              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Ambil tangkapan layar panggung"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                showGrid
                  ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                  : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-600'
              }`}
              title="Tampilkan / Sembunyikan Grid Koordinat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Layar Penuh"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Pilihan Pose & Skala Karakter Ringkas ───────────────────── */}
        <div className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded-xl border border-gray-200 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-700 mr-1">Pose:</span>
            {COSTUME_OPTIONS.map((c) => {
              const isActive = activeCostume === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCostumeChange?.(c.id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center p-0.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-blue-500 shadow-2xs ring-1 ring-blue-400'
                      : 'bg-white/60 hover:bg-white border-gray-200'
                  }`}
                  title={`${c.label} (${c.desc})`}
                >
                  <img src={c.src} alt={c.label} className="w-5 h-5 object-contain" />
                </button>
              );
            })}
          </div>

          {/* Stepper Ukuran Karakter */}
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => onSizeChange?.(Math.max(20, currentSize - 10))}
              className="w-5 h-5 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer"
              title="Perkecil karakter"
            >
              −
            </button>
            <span className="font-semibold text-gray-800 text-[11px] min-w-[32px] text-center">
              {currentSize}%
            </span>
            <button
              type="button"
              onClick={() => onSizeChange?.(Math.min(300, currentSize + 10))}
              className="w-5 h-5 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer"
              title="Perbesar karakter"
            >
              +
            </button>
          </div>
        </div>

        {/* Aksesibilitas Log (Tersembunyi secara visual agar UI bersih, tapi tetap ada untuk testing) */}
        <div className="sr-only" aria-live="polite">
          {state.logs.map((log, idx) => (
            <span key={idx}>{log.message}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
