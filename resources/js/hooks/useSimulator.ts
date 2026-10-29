/**
 * RoboKreasi — Hook useSimulator
 * Mengelola state simulator, menghubungkan runtime dengan SimulatorAPI.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { RobotSimulator, createDefaultArena, SimulationState } from '../components/simulator/robotSimulator';
import { ProgramRuntime } from '../lib/programRuntime';
import type { ProgramStatus, SimulatorState, ArenaState } from '../types/robokreasi';

// ─── State awal ───────────────────────────────────────────────────────────────

function createInitialState(arena: ArenaState): SimulatorState {
  return {
    robot: {
      x: arena.width / 2,
      y: arena.height / 2,
      angle: 0,
      speed: 5,
      isMoving: false,
    },
    arena,
    displayText: '',
    programStatus: 'idle',
    errorMessage: null,
    logs: [],
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseSimulatorReturn {
  simulatorState: SimulatorState;
  programStatus: ProgramStatus;
  errorMessage: string | null;
  isRunning: boolean;
  runProgram: (code: string, topBlocks: string[], allBlockTypes: string[]) => Promise<void>;
  stopProgram: () => void;
  resetSimulator: () => void;
}

export function useSimulator(): UseSimulatorReturn {
  const defaultArena = createDefaultArena(500, 400);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>(
    createInitialState(defaultArena)
  );
  const [programStatus, setProgramStatus] = useState<ProgramStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const simulatorRef = useRef<RobotSimulator | null>(null);
  const runtimeRef = useRef<ProgramRuntime | null>(null);

  // Inisialisasi simulator dan runtime
  useEffect(() => {
    const sim = new RobotSimulator(defaultArena, (state: SimulationState) => {
      setSimulatorState((prev) => ({
        ...state,
        programStatus: prev.programStatus,
        errorMessage: prev.errorMessage,
      }));
    });

    const runtime = new ProgramRuntime((status, message) => {
      setProgramStatus(status);
      if (status === 'error') {
        setErrorMessage(message ?? null);
      } else {
        setErrorMessage(null);
      }
      // Update programStatus di simulatorState juga
      setSimulatorState((prev) => ({
        ...prev,
        programStatus: status,
        errorMessage: status === 'error' ? (message ?? null) : null,
      }));
    });

    // Hubungkan simulator dengan runtime
    runtime.connectSimulator({
      maju: (l) => sim.maju(l),
      mundur: (l) => sim.mundur(l),
      belokKiri: (d) => sim.belokKiri(d),
      belokKanan: (d) => sim.belokKanan(d),
      berhenti: () => sim.berhenti(),
      aturKecepatan: (k) => sim.aturKecepatan(k),
      cekRintangan: () => sim.cekRintangan(),
      cekGaris: () => sim.cekGaris(),
      tampilkanTeks: (t) => sim.tampilkanTeks(t),
      mainkanNada: (n, d) => sim.mainkanNada(n, d),
      hentikanSuara: () => sim.hentikanSuara(),
      tidur: (ms) => sim.tidur(ms),
      cekDibatalkan: () => sim.cekDibatalkan(),
    });

    simulatorRef.current = sim;
    runtimeRef.current = runtime;

    return () => {
      runtime.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runProgram = useCallback(async (
    code: string,
    topBlocks: string[],
    allBlockTypes: string[]
  ) => {
    if (!runtimeRef.current) return;
    simulatorRef.current?.reset();
    setErrorMessage(null);
    await runtimeRef.current.run(code, topBlocks, allBlockTypes);
  }, []);

  const stopProgram = useCallback(() => {
    runtimeRef.current?.stop();
  }, []);

  const resetSimulator = useCallback(() => {
    runtimeRef.current?.stop();
    simulatorRef.current?.reset();
    setProgramStatus('idle');
    setErrorMessage(null);
  }, []);

  return {
    simulatorState,
    programStatus,
    errorMessage,
    isRunning: programStatus === 'running',
    runProgram,
    stopProgram,
    resetSimulator,
  };
}

