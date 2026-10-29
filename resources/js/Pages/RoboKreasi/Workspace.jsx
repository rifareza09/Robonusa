import React from 'react';

/**
 * RoboKreasi Workspace Component
 * 
 * Props sesuai Kontrak Integrasi Resmi:
 * - blockCategories: array kategori blok aktif
 * - blockDefinitions: array metadata definisi blok aktif
 * - exampleProjects: array proyek contoh dengan workspace_json
 * - guides: array panduan interaktif beserta steps
 */
export default function Workspace({
    blockCategories = [],
    blockDefinitions = [],
    exampleProjects = [],
    guides = []
}) {
    return (
        <div id="robokreasi-workspace" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <h1 className="text-xl font-bold tracking-tight">RoboKreasi</h1>
                </div>
                <div className="text-sm text-slate-400">
                    Mode Pembelajaran Robotika SD–SMP
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Area Workspace Blockly & Simulator (akan diisi oleh Developer A) */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <div className="p-8 bg-slate-800/60 rounded-2xl border border-slate-700 max-w-lg">
                        <h2 className="text-lg font-semibold text-sky-400 mb-2">
                            Workspace RoboKreasi Siap Digunakan
                        </h2>
                        <p className="text-sm text-slate-300 mb-4">
                            Data platform terhubung: {blockCategories.length} kategori, {blockDefinitions.length} blok, {exampleProjects.length} proyek contoh, {guides.length} panduan.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
