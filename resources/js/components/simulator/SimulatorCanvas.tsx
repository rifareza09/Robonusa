/**
 * RoboKreasi — Komponen Panggung & Simulator Robot
 * Desain presisi mengacu pada antarmuka PictoBlox / ScratchJr ("media_1793772443856_cdb78afb.png")
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
        fill="rgba(0, 0, 0, 0.15)"
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

// ─── Komponen Utama Panggung (PictoBlox Style) ────────────────────────────────

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
  const [isCostumePickerOpen, setIsCostumePickerOpen] = useState(false);
  const [isArenaPickerOpen, setIsArenaPickerOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const isRunning = programStatus === 'running';
  const activeCostume = state.robot.costume || 'default';
  const currentSize = state.robot.size ?? 100;

  // Tangkapan layar panggung (PictoBlox camera icon)
  const handleScreenshot = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panggung-robonusa-${Date.now()}.svg`;
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

  // Status mapping
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

  // Grid PictoBlox: 20 petak horizontal (0..20) dan 15 petak vertikal (0..15)
  const gridCols = 20;
  const gridRows = 15;
  const colWidth = width / gridCols;
  const rowHeight = height / gridRows;

  return (
    <div
      ref={containerRef}
      id="robot-simulator"
      className="flex flex-col h-full bg-[#FAFAFA] rounded-2xl border border-gray-200 overflow-hidden text-left select-none shadow-xs"
    >
      {/* ─── Header Mini Panggung (Kompak & Bersih) ───────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-gray-800">
            🤖 Simulator Robot
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
            Virtual
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Label (Diperlukan oleh testing & monitoring) */}
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
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

      <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* ─── Area Panggung PictoBlox dengan Ruler Koordinat 0-20 & 0-15 ─── */}
        <div className="flex flex-col bg-white rounded-xl border border-gray-300 overflow-hidden shadow-2xs">
          <div className="flex">
            {/* Penggaris Sumbu Y Vertikal (Angka 15..1 di sebelah kiri panggung) */}
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

                {/* Grid Titik Koordinat Sesuai Referensi PictoBlox */}
                {showGrid && (
                  <g opacity={0.35}>
                    {/* Titik-titik grid halus */}
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

          {/* Penggaris Sumbu X Horizontal (Angka 0..20 di bawah panggung, 10 di-highlight) */}
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

        {/* ─── Tombol Aksi Kontrol Panggung (Sesuai Bawah Panggung PictoBlox) ─ */}
        <div className="flex items-center justify-between px-1">
          {/* Tombol Play (Bendera Hijau) & Stop/Reset */}
          <div className="flex items-center gap-2">
            {/* Tombol Bendera Hijau (Green Flag) */}
            <button
              type="button"
              onClick={isRunning ? onStop : onRun}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isRunning
                  ? 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                  : 'bg-white hover:bg-emerald-50 border-gray-200 hover:border-emerald-400 text-emerald-600'
              }`}
              title={isRunning ? 'Hentikan Program' : 'Jalankan Program (Bendera Hijau)'}
            >
              {isRunning ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 2v20h2V14h6l1 2h7V6h-6l-1-2H4z" />
                </svg>
              )}
            </button>

            {/* Tombol Atur Ulang (Reset) */}
            <button
              type="button"
              onClick={onReset}
              className="w-9 h-9 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 text-purple-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Atur ulang posisi karakter (Reset)"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          {/* Tombol Kamera, Grid Toggle, Fullscreen */}
          <div className="flex items-center gap-1.5 text-gray-500">
            {/* Kamera / Screenshot */}
            <button
              type="button"
              onClick={handleScreenshot}
              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Ambil tangkapan layar panggung (Camera)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>

            {/* Toggle Grid Angka 0-20 & 0-15 */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                showGrid
                  ? 'bg-purple-100 border-purple-400 text-purple-700 font-bold'
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

            {/* Layar Penuh (Fullscreen) */}
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

        {/* ─── Rak Sprite & Scene PictoBlox (Bawah Kanvas) ─────────────── */}
        <div className="flex flex-col gap-2.5">
          {/* 1. Rak Karakter (Sprite Shelf) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-2.5 flex items-center gap-3 relative">
            {/* Tombol Tambah Karakter */}
            <button
              type="button"
              onClick={() => setIsCostumePickerOpen(!isCostumePickerOpen)}
              className="w-12 h-16 rounded-xl border border-dashed border-gray-300 hover:border-purple-400 bg-white/70 hover:bg-white flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
              title="Pilih Pose Karakter"
            >
              <span className="text-base">🤖</span>
              <span className="text-xs font-bold leading-none mt-1">+</span>
            </button>

            {/* Kartu Sprite Aktif (Tobi/Robo Style) */}
            <div className="relative bg-white rounded-xl border-2 border-purple-700 shadow-sm p-1.5 flex flex-col items-center justify-between w-20 h-20">
              {/* Tombol Brush Kostum (Kiri Atas) */}
              <button
                type="button"
                onClick={() => setIsCostumePickerOpen(!isCostumePickerOpen)}
                className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center text-[10px] shadow-sm cursor-pointer"
                title="Ganti Pose Karakter"
              >
                🖌️
              </button>

              {/* Tombol Reset Karakter (Kanan Atas) */}
              <button
                type="button"
                onClick={() => {
                  onCostumeChange?.('default');
                  onSizeChange?.(100);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center text-[10px] shadow-sm cursor-pointer"
                title="Reset Pose ke Berdiri"
              >
                ✕
              </button>

              {/* Thumbnail Karakter */}
              <div className="flex-1 flex items-center justify-center w-full">
                <img
                  src={COSTUME_MAP[activeCostume] || COSTUME_MAP.default}
                  alt="Robo"
                  className="max-h-10 max-w-full object-contain"
                />
              </div>

              {/* Tag Label Karakter */}
              <div className="w-full bg-purple-700 text-white text-[10px] font-bold text-center py-0.5 rounded-md">
                Robo
              </div>
            </div>

            {/* Popover Pemilih Kostum (Tampil saat tombol brush diklik) */}
            {isCostumePickerOpen && (
              <div className="absolute left-2 bottom-full mb-2 z-30 bg-white border-2 border-purple-600 rounded-2xl shadow-xl p-3 w-64 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                  <span className="text-xs font-bold text-gray-800">Pose Karakter</span>
                  <button
                    type="button"
                    onClick={() => setIsCostumePickerOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                  {COSTUME_OPTIONS.map((c) => {
                    const isActive = activeCostume === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onCostumeChange?.(c.id);
                          setIsCostumePickerOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-50 border-purple-600 shadow-2xs font-bold'
                            : 'bg-gray-50 hover:bg-white border-gray-200'
                        }`}
                        title={`${c.label} (${c.desc})`}
                      >
                        <img src={c.src} alt={c.label} className="w-7 h-7 object-contain" />
                        <span className="text-[9px] mt-0.5 text-gray-700">{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Kontrol Ukuran Karakter */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-gray-500 font-medium">Ukuran:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSizeChange?.(Math.max(20, currentSize - 10))}
                      className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="font-bold text-purple-700 text-xs min-w-[36px] text-center">
                      {currentSize}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onSizeChange?.(Math.min(300, currentSize + 10))}
                      className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center"
                    >
                      +
                    </button>
                    {currentSize !== 100 && (
                      <button
                        type="button"
                        onClick={() => onSizeChange?.(100)}
                        className="text-[10px] text-purple-600 underline font-semibold ml-1"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Rak Panggung / Arena (Scene Shelf) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-2.5 flex items-center gap-3 relative">
            {/* Tombol Tambah Panggung */}
            <button
              type="button"
              onClick={() => setIsArenaPickerOpen(!isArenaPickerOpen)}
              className="w-12 h-16 rounded-xl border border-dashed border-gray-300 hover:border-purple-400 bg-white/70 hover:bg-white flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
              title="Ganti Mode Arena / Panggung"
            >
              <span className="text-base">🎬</span>
              <span className="text-xs font-bold leading-none mt-1">+</span>
            </button>

            {/* Kartu Scene Aktif (Scene 1 Style) */}
            <div
              onClick={() => setIsArenaPickerOpen(!isArenaPickerOpen)}
              className="relative bg-white rounded-xl border-2 border-purple-700 shadow-sm p-1.5 flex flex-col items-center justify-between w-20 h-20 cursor-pointer"
            >
              {/* Tombol Gambar Latar (Kiri Atas) */}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] shadow-sm">
                🖼️
              </div>

              {/* Preview Arena */}
              <div className="flex-1 flex items-center justify-center w-full">
                <div className="w-10 h-7 bg-white border border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-600 font-semibold">
                  {arenaMode === 'empty' ? 'Polos' : arenaMode === 'obstacles' ? 'Rintangan' : 'Garis'}
                </div>
              </div>

              {/* Tag Label Scene */}
              <div className="w-full bg-purple-700 text-white text-[10px] font-bold text-center py-0.5 rounded-md">
                Panggung 1
              </div>
            </div>

            {/* Popover Pemilih Arena */}
            {isArenaPickerOpen && (
              <div className="absolute left-2 bottom-full mb-2 z-30 bg-white border-2 border-purple-600 rounded-2xl shadow-xl p-3 w-56 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
                  <span className="text-xs font-bold text-gray-800">Pilih Arena</span>
                  <button
                    type="button"
                    onClick={() => setIsArenaPickerOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(
                    [
                      { id: 'empty', label: 'Kanvas Polos', desc: 'Arena bebas' },
                      { id: 'obstacles', label: 'Arena Rintangan', desc: 'Rintangan virtual' },
                      { id: 'lines', label: 'Arena Garis', desc: 'Lintasan garis hitam' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onArenaModeChange?.(m.id);
                        setIsArenaPickerOpen(false);
                      }}
                      className={`text-left p-1.5 rounded-lg border text-xs transition-colors ${
                        arenaMode === m.id
                          ? 'bg-purple-50 border-purple-600 text-purple-800 font-bold'
                          : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-[10px] text-gray-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Catatan Konsol / Log Simulator ──────────────────────────── */}
        {state.logs.length > 0 && (
          <div className="px-2.5 py-1.5 bg-gray-100/70 rounded-xl border border-gray-200 text-[10px] font-mono max-h-16 overflow-y-auto text-gray-600">
            {state.logs.slice(-3).map((log, idx) => (
              <div key={idx} className="truncate">
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
