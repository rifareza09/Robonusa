<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect root ke halaman RoboKreasi Workspace
Route::get('/', function () {
    return redirect('/robokreasi');
});

// Route Workspace RoboKreasi sesuai Kontrak Integrasi Resmi v1
Route::get('/robokreasi', function () {
    return Inertia::render('RoboKreasi/Workspace', [
        'blockCategories' => [
            ['id' => 1, 'name' => 'Kejadian', 'slug' => 'kejadian', 'description' => 'Pemicu aksi', 'color_hex' => '#FF6B35', 'sort_order' => 1],
            ['id' => 2, 'name' => 'Gerakan', 'slug' => 'gerakan', 'description' => 'Pergerakan robot', 'color_hex' => '#4ECDC4', 'sort_order' => 2],
            ['id' => 3, 'name' => 'Kontrol', 'slug' => 'kontrol', 'description' => 'Logika dan alur', 'color_hex' => '#FFD93D', 'sort_order' => 3],
            ['id' => 4, 'name' => 'Operator', 'slug' => 'operator', 'description' => 'Operasi matematika & logika', 'color_hex' => '#95E1D3', 'sort_order' => 4],
            ['id' => 5, 'name' => 'Variabel', 'slug' => 'variabel', 'description' => 'Penyimpanan data', 'color_hex' => '#F38181', 'sort_order' => 5],
            ['id' => 6, 'name' => 'Sensor', 'slug' => 'sensor', 'description' => 'Sensor robot', 'color_hex' => '#A8E6CF', 'sort_order' => 6],
            ['id' => 7, 'name' => 'Tampilan', 'slug' => 'tampilan', 'description' => 'Teks simulator', 'color_hex' => '#C3A6FF', 'sort_order' => 7],
            ['id' => 8, 'name' => 'Suara', 'slug' => 'suara', 'description' => 'Efek suara', 'color_hex' => '#FFB3BA', 'sort_order' => 8],
        ],
        'blockDefinitions' => [],
        'exampleProjects' => [
            [
                'id' => 1,
                'name' => 'Robot Berkeliling',
                'slug' => 'robot-berkeliling',
                'description' => 'Robot maju 4 langkah dan belok kanan 90 derajat.',
                'difficulty' => 'mudah',
                'thumbnail' => null,
                'workspace_json' => [
                    'blocks' => [
                        'languageVersion' => 0,
                        'blocks' => [
                            [
                                'type' => 'event_start',
                                'id' => 'start1',
                                'x' => 30,
                                'y' => 30,
                                'next' => [
                                    'block' => [
                                        'type' => 'motion_forward',
                                        'id' => 'fwd1',
                                        'inputs' => [
                                            'STEPS' => [
                                                'block' => [
                                                    'type' => 'operator_number',
                                                    'id' => 'num1',
                                                    'fields' => ['NUM' => 4],
                                                ],
                                            ],
                                        ],
                                        'next' => [
                                            'block' => [
                                                'type' => 'motion_turn_right',
                                                'id' => 'turn1',
                                                'inputs' => [
                                                    'DEGREES' => [
                                                        'block' => [
                                                            'type' => 'operator_number',
                                                            'id' => 'num2',
                                                            'fields' => ['NUM' => 90],
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
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Sensor Deteksi Rintangan',
                'slug' => 'sensor-deteksi-rintangan',
                'description' => 'Robot mengecek rintangan sebelum melangkah.',
                'difficulty' => 'sedang',
                'thumbnail' => null,
                'workspace_json' => [
                    'blocks' => [
                        'languageVersion' => 0,
                        'blocks' => [
                            [
                                'type' => 'event_start',
                                'id' => 'start2',
                                'x' => 30,
                                'y' => 30,
                                'next' => [
                                    'block' => [
                                        'type' => 'control_repeat',
                                        'id' => 'repeat1',
                                        'inputs' => [
                                            'TIMES' => [
                                                'block' => [
                                                    'type' => 'operator_number',
                                                    'id' => 'num_rep',
                                                    'fields' => ['NUM' => 5],
                                                ],
                                            ],
                                            'DO' => [
                                                'block' => [
                                                    'type' => 'motion_forward',
                                                    'id' => 'fwd2',
                                                    'inputs' => [
                                                        'STEPS' => [
                                                            'block' => [
                                                                'type' => 'operator_number',
                                                                'id' => 'num_step',
                                                                'fields' => ['NUM' => 2],
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
                'sort_order' => 2,
            ],
        ],
        'guides' => [],
    ]);
});
