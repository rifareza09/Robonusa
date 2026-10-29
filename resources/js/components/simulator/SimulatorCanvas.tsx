/**
 * RoboKreasi — Komponen SVG Simulator Robot
 * Merender arena, robot, rintangan, garis, dan status program.
 * Animasi dijalankan via React state yang diperbarui oleh RobotSimulator.
 */

import React, { useRef } from 'react';
import type { SimulatorState, ProgramStatus } from '../../types/robokreasi';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SimulatorCanvasProps {
  state: SimulatorState;
  programStatus: ProgramStatus;
  width?: number;
  height?: number;
}

// ─── Warna ────────────────────────────────────────────────────────────────────

const COLORS = {
  ARENA_BG: '#F0F4F8',
  ARENA_BORDER: '#CBD5E0',
  ROBOT_BODY: '#4299E1',
  ROBOT_BODY_MOVING: '#48BB78',
  ROBOT_DIRECTION: '#FFFFFF',
  ROBOT_ERROR: '#FC8181',
  OBSTACLE: '#FC8181',
  OBSTACLE_STROKE: '#C53030',
  LINE: '#1A202C',
  DISPLAY_TEXT_BG: 'rgba(49, 130, 206, 0.9)',
  STATUS_RUNNING: '#48BB78',
  STATUS_STOPPED: '#FC8181',
  STATUS_ERROR: '#E53E3E',
  STATUS_IDLE: '#A0AEC0',
  STATUS_FINISHED: '#805AD5',
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
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Badan robot */}
      <circle
        r={18}
        fill={bodyColor}
        stroke="#2B6CB0"
        strokeWidth={2.5}
        style={{ transition: 'cx 0.15s ease, cy 0.15s ease' }}
      />
      {/* Arah hadap (segitiga) */}
      <polygon
        points="0,-14 8,4 -8,4"
        fill={COLORS.ROBOT_DIRECTION}
        opacity={0.9}
      />
      {/* Roda kiri */}
      <rect x={-22} y={-10} width={5} height={20} rx={2} fill="#2D3748" />
      {/* Roda kanan */}
      <rect x={17} y={-10} width={5} height={20} rx={2} fill="#2D3748" />
      {/* Sensor garis (titik bawah) */}
      <circle cx={0} cy={14} r={3} fill="#F6E05E" />
    </g>
  );
};

// ─── Komponen Rintangan ───────────────────────────────────────────────────────

const ObstacleBlock: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}> = ({ x, y, width, height }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={4}
      fill={COLORS.OBSTACLE}
      stroke={COLORS.OBSTACLE_STROKE}
      strokeWidth={2}
    />
    {/* Ikon dinding */}
    <text
      x={x + width / 2}
      y={y + height / 2 + 5}
      textAnchor="middle"
      fontSize={18}
      fill="white"
    >
      🧱
    </text>
  </g>
);

// ─── Indikator Status ─────────────────────────────────────────────────────────

const StatusIndicator: React.FC<{ status: ProgramStatus }> = ({ status }) => {
  const config: Record<ProgramStatus, { color: string; label: string; icon: string }> = {
    idle: { color: COLORS.STATUS_IDLE, label: 'Siap', icon: '⏹' },
    running: { color: COLORS.STATUS_RUNNING, label: 'Berjalan', icon: '▶' },
    stopped: { color: COLORS.STATUS_STOPPED, label: 'Dihentikan', icon: '⏹' },
    error: { color: COLORS.STATUS_ERROR, label: 'Error', icon: '❌' },
    finished: { color: COLORS.STATUS_FINISHED, label: 'Selesai', icon: '✅' },
  };

  const { color, label, icon } = config[status];

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

// ─── Komponen Utama Simulator ─────────────────────────────────────────────────

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  state,
  programStatus,
  width = 500,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div id="robot-simulator" className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header simulator */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <span className="font-bold text-sm">🤖 Simulator Robot</span>
        <StatusIndicator status={programStatus} />
      </div>

      {/* Arena SVG */}
      <div className="flex-1 flex items-center justify-center p-3 bg-gray-100">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          style={{ maxWidth: width, maxHeight: height }}
          className="rounded-lg border-2 border-gray-300"
          aria-label="Arena Robot"
        >
          {/* Background arena */}
          <rect
            width={width}
            height={height}
            fill={COLORS.ARENA_BG}
            stroke={COLORS.ARENA_BORDER}
            strokeWidth={3}
          />

          {/* Grid halus */}
          <defs>
            <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth={0.5} />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />

          {/* Garis hitam (jalur sensor) */}
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
              id={obs.id}
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

          {/* Teks display (jika ada) */}
          {state.displayText && (
            <g>
              <rect
                x={10}
                y={height - 40}
                width={width - 20}
                height={30}
                rx={6}
                fill={COLORS.DISPLAY_TEXT_BG}
              />
              <text
                x={width / 2}
                y={height - 20}
                textAnchor="middle"
                fill="white"
                fontSize={13}
                fontFamily="monospace"
              >
                {state.displayText.slice(0, 60)}
              </text>
            </g>
          )}

          {/* Label posisi robot (debug) */}
          <text x={5} y={14} fontSize={10} fill="#718096">
            ({Math.round(state.robot.x)}, {Math.round(state.robot.y)}) | {Math.round(state.robot.angle)}°
          </text>
        </svg>
      </div>

      {/* Info kecepatan */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <span>⚡ Kecepatan: {state.robot.speed}/10</span>
        <span>📍 Arah: {Math.round(state.robot.angle)}°</span>
        {state.robot.isMoving && (
          <span className="text-green-600 font-semibold animate-pulse">▶ Bergerak...</span>
        )}
      </div>

      {/* Log terakhir */}
      {state.logs.length > 0 && (
        <div className="px-3 py-2 bg-gray-800 text-xs font-mono max-h-20 overflow-y-auto">
          {state.logs.slice(-5).map((log, i) => (
            <div
              key={i}
              className={
                log.level === 'error'
                  ? 'text-red-400'
                  : log.level === 'warn'
                    ? 'text-yellow-400'
                    : 'text-gray-300'
              }
            >
              {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulatorCanvas;

