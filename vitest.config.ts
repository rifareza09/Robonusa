import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['resources/js/__tests__/setup.ts'],
    include: ['resources/js/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['resources/js/**/*.{ts,tsx}'],
      exclude: [
        'resources/js/__tests__/**',
        'resources/js/lib/programWorker.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
});

