<?php

namespace Database\Seeders;

use App\Models\ExampleProject;
use Illuminate\Database\Seeder;

class ExampleProjectSeeder extends Seeder
{
    /**
     * Seed proyek contoh.
     * Dapat dijalankan ulang tanpa duplikasi.
     *
     * CATATAN: workspace_json di bawah adalah struktur placeholder yang kompatibel
     * dengan format serialisasi Google Blockly (versi XML via Blockly.serialization).
     * Tim frontend WAJIB memverifikasi dan menyesuaikan workspace_json ini
     * dengan versi Blockly aktual yang digunakan di frontend sebelum integrasi final.
     *
     * Status: PERLU KOORDINASI FRONTEND — workspace_json menggambarkan logika program
     * dengan block_type yang sesuai kontrak, tetapi struktur internal XML Blockly
     * bergantung pada versi library yang dipakai Developer A.
     */
    public function run(): void
    {
        $projects = [
            // ─── PROYEK 1: Robot Pemilih Jalur ──────────────────────────────────
            [
                'name'        => 'Robot Pemilih Jalur',
                'slug'        => 'robot-pemilih-jalur',
                'description' => 'Robot yang dapat memilih jalur berdasarkan pembacaan sensor garis. '
                               . 'Cocok untuk pemula yang ingin belajar konsep percabangan (if-else) '
                               . 'dan pembacaan sensor.',
                'difficulty'  => 'pemula',
                'thumbnail'   => null,
                'sort_order'  => 1,
                'is_active'   => true,
                // workspace_json: placeholder struktur Blockly
                // Block types yang digunakan: event_start, control_forever,
                // control_if_else, sensor_line, motion_forward,
                // motion_turn_left, motion_turn_right
                //
                // ⚠️  PERLU VERIFIKASI FRONTEND:
                // Struktur XML di bawah menggambarkan logika program secara konseptual.
                // Developer A harus memverifikasi bahwa struktur ini kompatibel
                // dengan versi Google Blockly yang digunakan.
                'workspace_json' => [
                    '_comment'    => 'PLACEHOLDER — perlu verifikasi frontend sebelum integrasi final',
                    '_status'     => 'pending_frontend_verification',
                    '_logic'      => 'event_start -> control_forever -> control_if_else(sensor_line) -> motion_turn_left | motion_forward',
                    '_block_types' => ['event_start', 'control_forever', 'control_if_else', 'sensor_line', 'motion_forward', 'motion_turn_left', 'motion_turn_right'],
                    'blocks'      => [
                        'languageVersion' => 0,
                        'blocks'          => [
                            [
                                'type' => 'event_start',
                                'id'   => 'block_1',
                                'x'    => 50,
                                'y'    => 50,
                                'next' => [
                                    'block' => [
                                        'type'   => 'control_forever',
                                        'id'     => 'block_2',
                                        'inputs' => [
                                            'DO' => [
                                                'block' => [
                                                    'type'   => 'control_if_else',
                                                    'id'     => 'block_3',
                                                    'inputs' => [
                                                        'IF0' => [
                                                            'block' => [
                                                                'type'   => 'sensor_line',
                                                                'id'     => 'block_4',
                                                                'fields' => ['side' => 'kiri'],
                                                            ],
                                                        ],
                                                        'DO0' => [
                                                            'block' => [
                                                                'type'   => 'motion_turn_right',
                                                                'id'     => 'block_5',
                                                                'fields' => ['degrees' => 15],
                                                            ],
                                                        ],
                                                        'ELSE' => [
                                                            'block' => [
                                                                'type'   => 'motion_forward',
                                                                'id'     => 'block_6',
                                                                'fields' => ['steps' => 1],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // ─── PROYEK 2: Menghindari Rintangan Virtual ────────────────────────
            [
                'name'        => 'Algoritma Menghindari Rintangan Virtual',
                'slug'        => 'menghindari-rintangan-virtual',
                'description' => 'Robot yang secara otomatis mendeteksi rintangan di depannya '
                               . 'dan berbelok untuk menghindarinya. Memperkenalkan sensor rintangan '
                               . 'dan pola pengulangan tak terbatas.',
                'difficulty'  => 'menengah',
                'thumbnail'   => null,
                'sort_order'  => 2,
                'is_active'   => true,
                // Block types: event_start, control_forever, control_if,
                // sensor_obstacle, motion_backward, motion_turn_right, motion_forward
                //
                // ⚠️  PERLU VERIFIKASI FRONTEND
                'workspace_json' => [
                    '_comment'    => 'PLACEHOLDER — perlu verifikasi frontend sebelum integrasi final',
                    '_status'     => 'pending_frontend_verification',
                    '_logic'      => 'event_start -> control_forever -> control_if(sensor_obstacle) -> motion_backward + motion_turn_right | motion_forward',
                    '_block_types' => ['event_start', 'control_forever', 'control_if', 'sensor_obstacle', 'motion_backward', 'motion_turn_right', 'motion_forward'],
                    'blocks'      => [
                        'languageVersion' => 0,
                        'blocks'          => [
                            [
                                'type' => 'event_start',
                                'id'   => 'block_1',
                                'x'    => 50,
                                'y'    => 50,
                                'next' => [
                                    'block' => [
                                        'type'   => 'motion_set_speed',
                                        'id'     => 'block_2',
                                        'fields' => ['speed' => 5],
                                        'next'   => [
                                            'block' => [
                                                'type'   => 'control_forever',
                                                'id'     => 'block_3',
                                                'inputs' => [
                                                    'DO' => [
                                                        'block' => [
                                                            'type'   => 'control_if',
                                                            'id'     => 'block_4',
                                                            'inputs' => [
                                                                'IF0' => [
                                                                    'block' => [
                                                                        'type' => 'sensor_obstacle',
                                                                        'id'   => 'block_5',
                                                                    ],
                                                                ],
                                                                'DO0' => [
                                                                    'block' => [
                                                                        'type'   => 'motion_backward',
                                                                        'id'     => 'block_6',
                                                                        'fields' => ['steps' => 2],
                                                                        'next'   => [
                                                                            'block' => [
                                                                                'type'   => 'motion_turn_right',
                                                                                'id'     => 'block_7',
                                                                                'fields' => ['degrees' => 90],
                                                                            ],
                                                                        ],
                                                                    ],
                                                                ],
                                                            ],
                                                            'next' => [
                                                                'block' => [
                                                                    'type'   => 'motion_forward',
                                                                    'id'     => 'block_8',
                                                                    'fields' => ['steps' => 1],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // ─── PROYEK 3: Hitung Mundur Interaktif ─────────────────────────────
            [
                'name'        => 'Program Hitung Mundur Interaktif',
                'slug'        => 'hitung-mundur-interaktif',
                'description' => 'Program yang menampilkan hitungan mundur dari 10 ke 0 di layar simulator. '
                               . 'Memperkenalkan konsep variabel, pengulangan, dan tampilan teks. '
                               . 'Cocok untuk belajar konsep dasar pemrograman tanpa robot fisik.',
                'difficulty'  => 'pemula',
                'thumbnail'   => null,
                'sort_order'  => 3,
                'is_active'   => true,
                // Block types: event_start, variable_set, control_repeat,
                // display_text, variable_get, variable_change, display_text
                //
                // ⚠️  PERLU VERIFIKASI FRONTEND
                'workspace_json' => [
                    '_comment'    => 'PLACEHOLDER — perlu verifikasi frontend sebelum integrasi final',
                    '_status'     => 'pending_frontend_verification',
                    '_logic'      => 'event_start -> variable_set(hitung, 10) -> control_repeat(10) -> display_text(hitung) -> variable_change(hitung, -1) -> display_text(Selesai!)',
                    '_block_types' => ['event_start', 'variable_set', 'variable_get', 'variable_change', 'control_repeat', 'display_text'],
                    'variables'   => [
                        ['name' => 'hitung', 'id' => 'var_hitung'],
                    ],
                    'blocks'      => [
                        'languageVersion' => 0,
                        'blocks'          => [
                            [
                                'type' => 'event_start',
                                'id'   => 'block_1',
                                'x'    => 50,
                                'y'    => 50,
                                'next' => [
                                    'block' => [
                                        'type'   => 'variable_set',
                                        'id'     => 'block_2',
                                        'fields' => ['variable' => 'hitung'],
                                        'inputs' => [
                                            'VALUE' => [
                                                'shadow' => ['type' => 'math_number', 'fields' => ['NUM' => 10]],
                                            ],
                                        ],
                                        'next' => [
                                            'block' => [
                                                'type'   => 'control_repeat',
                                                'id'     => 'block_3',
                                                'fields' => ['times' => 11],
                                                'inputs' => [
                                                    'DO' => [
                                                        'block' => [
                                                            'type'   => 'display_text',
                                                            'id'     => 'block_4',
                                                            'inputs' => [
                                                                'TEXT' => [
                                                                    'block' => [
                                                                        'type'   => 'variable_get',
                                                                        'id'     => 'block_5',
                                                                        'fields' => ['variable' => 'hitung'],
                                                                    ],
                                                                ],
                                                            ],
                                                            'next' => [
                                                                'block' => [
                                                                    'type'   => 'variable_change',
                                                                    'id'     => 'block_6',
                                                                    'fields' => ['variable' => 'hitung', 'amount' => -1],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                                'next' => [
                                                    'block' => [
                                                        'type'   => 'display_text',
                                                        'id'     => 'block_7',
                                                        'fields' => ['text' => 'Selesai! 🎉'],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($projects as $projectData) {
            ExampleProject::updateOrCreate(
                ['slug' => $projectData['slug']],
                $projectData
            );
        }

        $this->command->info('ExampleProject seeded: ' . count($projects) . ' projects.');
        $this->command->warn('⚠️  workspace_json adalah placeholder. Koordinasikan dengan Developer A (frontend) untuk verifikasi struktur Blockly.');
    }
}
