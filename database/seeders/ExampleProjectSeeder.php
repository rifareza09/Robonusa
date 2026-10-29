<?php

namespace Database\Seeders;

use App\Models\ExampleProject;
use Illuminate\Database\Seeder;

class ExampleProjectSeeder extends Seeder
{
    /**
     * Seed proyek contoh RoboKreasi.
     * Struktur workspace_json diverifikasi kompatibel penuh dengan Blockly 13.x
     * dan seluruh definisi blok yang terdaftar di frontend (Developer A).
     */
    public function run(): void
    {
        $projects = [
            // ─── PROYEK 1: Robot Pemilih Jalur ──────────────────────────────────
            [
                'name'        => 'Robot Pemilih Jalur',
                'slug'        => 'robot-pemilih-jalur',
                'description' => 'Robot yang dapat memilih jalur berdasarkan pembacaan sensor garis. '
                               . 'Mengenalkan percabangan logika (Jika-Maka-Jika-Tidak) dan sensor garis.',
                'difficulty'  => 'pemula',
                'thumbnail'   => null,
                'sort_order'  => 1,
                'is_active'   => true,
                'workspace_json' => [
                    'blocks' => [
                        'languageVersion' => 0,
                        'blocks' => [
                            [
                                'type' => 'event_start',
                                'id' => 'start_1',
                                'x' => 40,
                                'y' => 40,
                                'next' => [
                                    'block' => [
                                        'type' => 'control_forever',
                                        'id' => 'forever_1',
                                        'inputs' => [
                                            'DO' => [
                                                'block' => [
                                                    'type' => 'control_if_else',
                                                    'id' => 'if_1',
                                                    'inputs' => [
                                                        'CONDITION' => [
                                                            'block' => [
                                                                'type' => 'sensor_line',
                                                                'id' => 'line_1',
                                                            ],
                                                        ],
                                                        'DO' => [
                                                            'block' => [
                                                                'type' => 'motion_forward',
                                                                'id' => 'fwd_1',
                                                                'inputs' => [
                                                                    'STEPS' => [
                                                                        'block' => [
                                                                            'type' => 'operator_number',
                                                                            'id' => 'step_1',
                                                                            'fields' => ['NUM' => 1],
                                                                        ],
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                        'ELSE' => [
                                                            'block' => [
                                                                'type' => 'motion_turn_right',
                                                                'id' => 'turn_1',
                                                                'inputs' => [
                                                                    'DEGREES' => [
                                                                        'block' => [
                                                                            'type' => 'operator_number',
                                                                            'id' => 'deg_1',
                                                                            'fields' => ['NUM' => 15],
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
                ],
            ],

            // ─── PROYEK 2: Menghindari Rintangan Virtual ────────────────────────
            [
                'name'        => 'Algoritma Menghindari Rintangan Virtual',
                'slug'        => 'menghindari-rintangan-virtual',
                'description' => 'Robot otomatis mendeteksi rintangan di depannya, mundur, lalu berbelok untuk menghindar.',
                'difficulty'  => 'menengah',
                'thumbnail'   => null,
                'sort_order'  => 2,
                'is_active'   => true,
                'workspace_json' => [
                    'blocks' => [
                        'languageVersion' => 0,
                        'blocks' => [
                            [
                                'type' => 'event_start',
                                'id' => 'start_2',
                                'x' => 40,
                                'y' => 40,
                                'next' => [
                                    'block' => [
                                        'type' => 'motion_set_speed',
                                        'id' => 'speed_1',
                                        'inputs' => [
                                            'SPEED' => [
                                                'block' => [
                                                    'type' => 'operator_number',
                                                    'id' => 'spd_val',
                                                    'fields' => ['NUM' => 5],
                                                ],
                                            ],
                                        ],
                                        'next' => [
                                            'block' => [
                                                'type' => 'control_forever',
                                                'id' => 'forever_2',
                                                'inputs' => [
                                                    'DO' => [
                                                        'block' => [
                                                            'type' => 'control_if_else',
                                                            'id' => 'if_2',
                                                            'inputs' => [
                                                                'CONDITION' => [
                                                                  'block' => [
                                                                    'type' => 'sensor_obstacle',
                                                                    'id' => 'obs_1',
                                                                  ],
                                                                ],
                                                                'DO' => [
                                                                  'block' => [
                                                                    'type' => 'motion_backward',
                                                                    'id' => 'bwd_1',
                                                                    'inputs' => [
                                                                      'STEPS' => [
                                                                        'block' => [
                                                                          'type' => 'operator_number',
                                                                          'id' => 'bwd_step',
                                                                          'fields' => ['NUM' => 2],
                                                                        ],
                                                                      ],
                                                                    ],
                                                                    'next' => [
                                                                      'block' => [
                                                                        'type' => 'motion_turn_right',
                                                                        'id' => 'turn_2',
                                                                        'inputs' => [
                                                                          'DEGREES' => [
                                                                            'block' => [
                                                                              'type' => 'operator_number',
                                                                              'id' => 'turn_deg',
                                                                              'fields' => ['NUM' => 90],
                                                                            ],
                                                                          ],
                                                                        ],
                                                                      ],
                                                                    ],
                                                                  ],
                                                                ],
                                                                'ELSE' => [
                                                                  'block' => [
                                                                    'type' => 'motion_forward',
                                                                    'id' => 'fwd_2',
                                                                    'inputs' => [
                                                                      'STEPS' => [
                                                                        'block' => [
                                                                          'type' => 'operator_number',
                                                                          'id' => 'fwd_step',
                                                                          'fields' => ['NUM' => 1],
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
                        ],
                    ],
                ],
            ],

            // ─── PROYEK 3: Hitung Mundur Interaktif ─────────────────────────────
            [
                'name'        => 'Program Hitung Mundur Interaktif',
                'slug'        => 'hitung-mundur-interaktif',
                'description' => 'Program yang menampilkan hitungan mundur dari 5 ke 1 dan pesan selesai di simulator.',
                'difficulty'  => 'pemula',
                'thumbnail'   => null,
                'sort_order'  => 3,
                'is_active'   => true,
                'workspace_json' => [
                    'blocks' => [
                        'languageVersion' => 0,
                        'blocks' => [
                            [
                                'type' => 'event_start',
                                'id' => 'start_3',
                                'x' => 40,
                                'y' => 40,
                                'next' => [
                                    'block' => [
                                        'type' => 'variable_set',
                                        'id' => 'var_set_1',
                                        'fields' => ['VAR' => 'hitung'],
                                        'inputs' => [
                                            'VALUE' => [
                                                'block' => [
                                                    'type' => 'operator_number',
                                                    'id' => 'val_10',
                                                    'fields' => ['NUM' => 5],
                                                ],
                                            ],
                                        ],
                                        'next' => [
                                            'block' => [
                                                'type' => 'control_repeat',
                                                'id' => 'repeat_1',
                                                'inputs' => [
                                                    'TIMES' => [
                                                        'block' => [
                                                            'type' => 'operator_number',
                                                            'id' => 'times_5',
                                                            'fields' => ['NUM' => 5],
                                                        ],
                                                    ],
                                                    'DO' => [
                                                        'block' => [
                                                            'type' => 'display_text',
                                                            'id' => 'disp_1',
                                                            'inputs' => [
                                                                'TEXT' => [
                                                                    'block' => [
                                                                        'type' => 'variable_get',
                                                                        'id' => 'get_1',
                                                                        'fields' => ['VAR' => 'hitung'],
                                                                    ],
                                                                ],
                                                            ],
                                                            'next' => [
                                                                'block' => [
                                                                    'type' => 'variable_change',
                                                                    'id' => 'chg_1',
                                                                    'fields' => ['VAR' => 'hitung'],
                                                                    'inputs' => [
                                                                        'VALUE' => [
                                                                            'block' => [
                                                                                'type' => 'operator_number',
                                                                                'id' => 'minus_1',
                                                                                'fields' => ['NUM' => -1],
                                                                            ],
                                                                        ],
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                                'next' => [
                                                    'block' => [
                                                        'type' => 'display_text',
                                                        'id' => 'disp_done',
                                                        'inputs' => [
                                                            'TEXT' => [
                                                                'block' => [
                                                                    'type' => 'rk_text',
                                                                    'id' => 'done_text',
                                                                    'fields' => ['TEXT' => 'Selesai! 🎉'],
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
        ];

        foreach ($projects as $projectData) {
            ExampleProject::updateOrCreate(
                ['slug' => $projectData['slug']],
                $projectData
            );
        }

        $this->command->info('ExampleProject seeded: ' . count($projects) . ' projects.');
    }
}
