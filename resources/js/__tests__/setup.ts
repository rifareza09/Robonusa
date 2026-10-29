/**
 * Setup file Vitest — dijalankan sebelum semua test
 */
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Worker API (tidak tersedia di Node.js/jsdom)
global.Worker = vi.fn().mockImplementation(() => ({
  postMessage: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  terminate: vi.fn(),
})) as unknown as typeof Worker;

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
global.URL.revokeObjectURL = vi.fn();

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    frequency: { setValueAtTime: vi.fn() },
    type: 'sine',
    start: vi.fn(),
    stop: vi.fn(),
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  }),
  destination: {},
  currentTime: 0,
  close: vi.fn().mockResolvedValue(undefined),
})) as unknown as typeof AudioContext;

