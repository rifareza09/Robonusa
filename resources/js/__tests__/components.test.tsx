/**
 * Tests — UI Components (Toolbar, Simulator Canvas, Example Projects Panel)
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramToolbar } from '../components/blockly/ProgramToolbar';
import { ExampleProjectsPanel } from '../components/blockly/ExampleProjectsPanel';
import { SimulatorCanvas } from '../components/simulator/SimulatorCanvas';
import { buildToolboxConfig } from '../components/blockly/toolboxConfig';
import { createDefaultArena } from '../components/simulator/robotSimulator';
import type { ExampleProject, SimulatorState } from '../types/robokreasi';

describe('Toolbox Configuration', () => {
  it('harus memiliki semua 8 kategori yang disyaratkan', () => {
    const toolbox = buildToolboxConfig() as {
      kind: string;
      contents: Array<{ kind: string; name: string }>;
    };
    expect(toolbox.kind).toBe('categoryToolbox');

    const names = toolbox.contents.map((c) => c.name);
    expect(names.some((n) => n.includes('Kejadian'))).toBe(true);
    expect(names.some((n) => n.includes('Gerakan'))).toBe(true);
    expect(names.some((n) => n.includes('Kontrol'))).toBe(true);
    expect(names.some((n) => n.includes('Operator'))).toBe(true);
    expect(names.some((n) => n.includes('Variabel'))).toBe(true);
    expect(names.some((n) => n.includes('Sensor'))).toBe(true);
    expect(names.some((n) => n.includes('Tampilan'))).toBe(true);
    expect(names.some((n) => n.includes('Suara'))).toBe(true);
    expect(toolbox.contents.length).toBe(8);
  });
});

describe('ProgramToolbar', () => {
  const defaultProps = {
    programStatus: 'idle' as const,
    canUndo: true,
    canRedo: false,
    errorMessage: null,
    projectName: 'Robot Keren',
    onRun: vi.fn(),
    onStop: vi.fn(),
    onReset: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onExport: vi.fn(),
    onImport: vi.fn(),
    onProjectNameChange: vi.fn(),
    onOpenGuide: vi.fn(),
    onOpenExamplesModal: vi.fn(),
  };

  it('harus merender menu File, Edit, Panduan/Belajar, dan nama proyek', () => {
    render(<ProgramToolbar {...defaultProps} />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Panduan/Belajar')).toBeInTheDocument();
    expect(screen.getByText('Robot Keren')).toBeInTheDocument();
  });

  it('harus membuka dropdown Edit dan memanggil onUndo dan onRedo', () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(
      <ProgramToolbar
        {...defaultProps}
        canUndo={true}
        canRedo={true}
        onUndo={onUndo}
        onRedo={onRedo}
      />
    );
    // Buka menu Edit
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Urungkan')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Urungkan'));
    expect(onUndo).toHaveBeenCalledTimes(1);

    // Buka menu Edit lagi untuk Ulangi
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Ulangi')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ulangi'));
    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it('harus membuka dropdown File dan memanggil onImport dan onExport', () => {
    const onImport = vi.fn();
    const onExport = vi.fn();
    render(
      <ProgramToolbar
        {...defaultProps}
        onImport={onImport}
        onExport={onExport}
      />
    );
    // Buka menu File
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Buka proyek')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Buka proyek'));
    expect(onImport).toHaveBeenCalledTimes(1);

    // Buka menu File lagi untuk Simpan proyek
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Simpan proyek')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Simpan proyek'));
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it('harus membuka dropdown Panduan/Belajar dan memanggil modal terkait', () => {
    const onOpenExamples = vi.fn();
    const onOpenGuide = vi.fn();
    render(
      <ProgramToolbar
        {...defaultProps}
        onOpenExamplesModal={onOpenExamples}
        onOpenGuide={onOpenGuide}
      />
    );
    // Buka menu Panduan/Belajar
    fireEvent.click(screen.getByText('Panduan/Belajar'));
    expect(screen.getByText('Contoh Proyek')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Contoh Proyek'));
    expect(onOpenExamples).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Panduan/Belajar'));
    expect(screen.getByText('Panduan')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Panduan'));
    expect(onOpenGuide).toHaveBeenCalledTimes(1);
  });

  it('harus menampilkan pesan error jika ada', () => {
    render(<ProgramToolbar {...defaultProps} errorMessage="Ada tabrakan!" />);
    expect(screen.getByText('Ada tabrakan!')).toBeInTheDocument();
  });
});

describe('ExampleProjectsPanel', () => {
  const dummyProjects: ExampleProject[] = [
    {
      id: 1,
      name: 'Robot Penjelajah',
      slug: 'robot-penjelajah',
      description: 'Robot menjelajahi arena tanpa menabrak rintangan.',
      difficulty: 'mudah',
      thumbnail: null,
      workspace_json: { blocks: { languageVersion: 0, blocks: [] } },
      sort_order: 1,
    },
    {
      id: 2,
      name: 'Pengikut Garis',
      slug: 'pengikut-garis',
      description: 'Robot mengikuti garis hitam di lantai.',
      difficulty: 'sedang',
      thumbnail: null,
      workspace_json: { blocks: { languageVersion: 0, blocks: [] } },
      sort_order: 2,
    },
  ];

  it('harus merender daftar proyek contoh', () => {
    render(
      <ExampleProjectsPanel projects={dummyProjects} onLoadProject={vi.fn()} />
    );
    expect(screen.getByText('Robot Penjelajah')).toBeInTheDocument();
    expect(screen.getByText('Pengikut Garis')).toBeInTheDocument();
    expect(screen.getByText(/Mudah/)).toBeInTheDocument();
    expect(screen.getByText(/Sedang/)).toBeInTheDocument();
  });

  it('harus memanggil onLoadProject saat tombol diklik', () => {
    const onLoad = vi.fn();
    render(
      <ExampleProjectsPanel projects={dummyProjects} onLoadProject={onLoad} />
    );
    const buttons = screen.getAllByText('➕ Buka Proyek Ini');
    fireEvent.click(buttons[0]);
    expect(onLoad).toHaveBeenCalledWith(dummyProjects[0]);
  });
});

describe('SimulatorCanvas', () => {
  const dummyState: SimulatorState = {
    robot: {
      x: 250,
      y: 200,
      angle: 90,
      speed: 6,
      isMoving: false,
    },
    arena: createDefaultArena(500, 400),
    displayText: 'Robot Siap!',
    programStatus: 'idle',
    errorMessage: null,
    logs: [{ timestamp: Date.now(), message: 'Tes log 1', level: 'info' }],
  };

  it('harus merender SVG arena dan elemen simulator', () => {
    render(
      <SimulatorCanvas state={dummyState} programStatus="idle" width={500} height={400} />
    );
    expect(screen.getByLabelText('Panggung Robot')).toBeInTheDocument();
    expect(screen.getByText('Siap')).toBeInTheDocument();
    expect(screen.getByText('Robot Siap!')).toBeInTheDocument();
    expect(screen.getByText('Tes log 1')).toBeInTheDocument();
  });

  it('harus memanggil onRun saat bendera hijau diklik', () => {
    const onRun = vi.fn();
    render(
      <SimulatorCanvas
        state={dummyState}
        programStatus="idle"
        width={500}
        height={400}
        onRun={onRun}
      />
    );
    const flagBtn = screen.getByRole('button', { name: /bendera hijau/i });
    fireEvent.click(flagBtn);
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('harus memanggil onStop saat tombol hentikan diklik ketika status running', () => {
    const onStop = vi.fn();
    render(
      <SimulatorCanvas
        state={dummyState}
        programStatus="running"
        width={500}
        height={400}
        onStop={onStop}
      />
    );
    const stopBtn = screen.getByRole('button', { name: /hentikan program/i });
    fireEvent.click(stopBtn);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('harus memanggil onReset saat tombol atur ulang diklik', () => {
    const onReset = vi.fn();
    render(
      <SimulatorCanvas
        state={dummyState}
        programStatus="idle"
        width={500}
        height={400}
        onReset={onReset}
      />
    );
    const resetBtn = screen.getByRole('button', { name: /atur ulang/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
