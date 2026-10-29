<?php

namespace Database\Seeders;

use App\Models\BlockCategory;
use App\Models\BlockDefinition;
use Illuminate\Database\Seeder;

class BlockDefinitionSeeder extends Seeder
{
    /**
     * Seed metadata definisi blok.
     * Dapat dijalankan ulang tanpa duplikasi (menggunakan block_type sebagai kunci unik).
     *
     * CATATAN: Ini adalah METADATA blok, bukan kode JavaScript yang dapat dieksekusi.
     * Implementasi perilaku, definisi Blockly, dan generator tetap di frontend.
     */
    public function run(): void
    {
        $kejadian    = BlockCategory::where('slug', 'kejadian')->firstOrFail();
        $gerakan     = BlockCategory::where('slug', 'gerakan')->firstOrFail();
        $kontrol     = BlockCategory::where('slug', 'kontrol')->firstOrFail();
        $operator    = BlockCategory::where('slug', 'operator')->firstOrFail();
        $variabel    = BlockCategory::where('slug', 'variabel')->firstOrFail();
        $sensor      = BlockCategory::where('slug', 'sensor')->firstOrFail();
        $tampilan    = BlockCategory::where('slug', 'tampilan')->firstOrFail();
        $suara       = BlockCategory::where('slug', 'suara')->firstOrFail();

        $definitions = [
            // ─── KEJADIAN ───────────────────────────────────────────────────────
            [
                'block_category_id' => $kejadian->id,
                'block_type'        => 'event_start',
                'display_name'      => 'Ketika Program Mulai',
                'description'       => 'Blok pemicu utama. Program dimulai saat blok ini dieksekusi.',
                'block_shape'       => 'hat',
                'parameter_schema'  => null,
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $kejadian->id,
                'block_type'        => 'event_key_pressed',
                'display_name'      => 'Ketika Tombol Ditekan',
                'description'       => 'Memulai blok di bawahnya ketika tombol keyboard tertentu ditekan.',
                'block_shape'       => 'hat',
                'parameter_schema'  => [
                    'key' => ['type' => 'string', 'default' => 'space', 'options' => ['space', 'enter', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']],
                ],
                'sort_order'        => 2,
                'is_active'         => true,
            ],

            // ─── GERAKAN ────────────────────────────────────────────────────────
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_forward',
                'display_name'      => 'Maju',
                'description'       => 'Menggerakkan robot maju sejauh jarak tertentu (dalam satuan langkah).',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'steps' => ['type' => 'integer', 'default' => 1, 'min' => 1, 'max' => 100],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_backward',
                'display_name'      => 'Mundur',
                'description'       => 'Menggerakkan robot mundur sejauh jarak tertentu.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'steps' => ['type' => 'integer', 'default' => 1, 'min' => 1, 'max' => 100],
                ],
                'sort_order'        => 2,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_turn_left',
                'display_name'      => 'Belok Kiri',
                'description'       => 'Memutar robot ke kiri sebesar sudut tertentu.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'degrees' => ['type' => 'integer', 'default' => 90, 'min' => 1, 'max' => 360],
                ],
                'sort_order'        => 3,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_turn_right',
                'display_name'      => 'Belok Kanan',
                'description'       => 'Memutar robot ke kanan sebesar sudut tertentu.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'degrees' => ['type' => 'integer', 'default' => 90, 'min' => 1, 'max' => 360],
                ],
                'sort_order'        => 4,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_stop',
                'display_name'      => 'Berhenti',
                'description'       => 'Menghentikan semua gerakan robot.',
                'block_shape'       => 'cap',
                'parameter_schema'  => null,
                'sort_order'        => 5,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $gerakan->id,
                'block_type'        => 'motion_set_speed',
                'display_name'      => 'Atur Kecepatan',
                'description'       => 'Mengatur kecepatan gerak robot (1–10).',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'speed' => ['type' => 'integer', 'default' => 5, 'min' => 1, 'max' => 10],
                ],
                'sort_order'        => 6,
                'is_active'         => true,
            ],

            // ─── KONTROL ────────────────────────────────────────────────────────
            [
                'block_category_id' => $kontrol->id,
                'block_type'        => 'control_repeat',
                'display_name'      => 'Ulangi … Kali',
                'description'       => 'Mengulangi blok di dalamnya sebanyak n kali.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'times' => ['type' => 'integer', 'default' => 10, 'min' => 1, 'max' => 1000],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $kontrol->id,
                'block_type'        => 'control_forever',
                'display_name'      => 'Ulangi Selamanya',
                'description'       => 'Mengulangi blok di dalamnya tanpa batas hingga program dihentikan.',
                'block_shape'       => 'cap',
                'parameter_schema'  => null,
                'sort_order'        => 2,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $kontrol->id,
                'block_type'        => 'control_if',
                'display_name'      => 'Jika … Maka',
                'description'       => 'Menjalankan blok di dalamnya hanya jika kondisi bernilai benar.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'condition' => ['type' => 'boolean_block'],
                ],
                'sort_order'        => 3,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $kontrol->id,
                'block_type'        => 'control_if_else',
                'display_name'      => 'Jika … Maka … Kalau Tidak',
                'description'       => 'Percabangan dua arah: jalankan blok A jika benar, blok B jika salah.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'condition' => ['type' => 'boolean_block'],
                ],
                'sort_order'        => 4,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $kontrol->id,
                'block_type'        => 'control_wait',
                'display_name'      => 'Tunggu … Detik',
                'description'       => 'Menghentikan eksekusi sementara selama durasi tertentu.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'seconds' => ['type' => 'number', 'default' => 1, 'min' => 0.1, 'max' => 60],
                ],
                'sort_order'        => 5,
                'is_active'         => true,
            ],

            // ─── OPERATOR ───────────────────────────────────────────────────────
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_add',
                'display_name'      => 'Tambah',
                'description'       => 'Menjumlahkan dua nilai.',
                'block_shape'       => 'value',
                'parameter_schema'  => [
                    'left'  => ['type' => 'number_block'],
                    'right' => ['type' => 'number_block'],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_subtract',
                'display_name'      => 'Kurang',
                'description'       => 'Mengurangi nilai kanan dari nilai kiri.',
                'block_shape'       => 'value',
                'parameter_schema'  => [
                    'left'  => ['type' => 'number_block'],
                    'right' => ['type' => 'number_block'],
                ],
                'sort_order'        => 2,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_greater_than',
                'display_name'      => 'Lebih Besar Dari',
                'description'       => 'Bernilai benar jika nilai kiri lebih besar dari nilai kanan.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'left'  => ['type' => 'number_block'],
                    'right' => ['type' => 'number_block'],
                ],
                'sort_order'        => 3,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_less_than',
                'display_name'      => 'Lebih Kecil Dari',
                'description'       => 'Bernilai benar jika nilai kiri lebih kecil dari nilai kanan.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'left'  => ['type' => 'number_block'],
                    'right' => ['type' => 'number_block'],
                ],
                'sort_order'        => 4,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_equals',
                'display_name'      => 'Sama Dengan',
                'description'       => 'Bernilai benar jika kedua nilai sama.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'left'  => ['type' => 'number_block'],
                    'right' => ['type' => 'number_block'],
                ],
                'sort_order'        => 5,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_and',
                'display_name'      => 'Dan',
                'description'       => 'Bernilai benar jika kedua kondisi benar.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'left'  => ['type' => 'boolean_block'],
                    'right' => ['type' => 'boolean_block'],
                ],
                'sort_order'        => 6,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_or',
                'display_name'      => 'Atau',
                'description'       => 'Bernilai benar jika salah satu kondisi benar.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'left'  => ['type' => 'boolean_block'],
                    'right' => ['type' => 'boolean_block'],
                ],
                'sort_order'        => 7,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $operator->id,
                'block_type'        => 'operator_not',
                'display_name'      => 'Tidak',
                'description'       => 'Membalikkan nilai boolean.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'condition' => ['type' => 'boolean_block'],
                ],
                'sort_order'        => 8,
                'is_active'         => true,
            ],

            // ─── VARIABEL ───────────────────────────────────────────────────────
            [
                'block_category_id' => $variabel->id,
                'block_type'        => 'variable_set',
                'display_name'      => 'Simpan ke Variabel',
                'description'       => 'Mengatur nilai sebuah variabel.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'variable' => ['type' => 'variable_name'],
                    'value'    => ['type' => 'any_block'],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $variabel->id,
                'block_type'        => 'variable_get',
                'display_name'      => 'Baca Variabel',
                'description'       => 'Membaca nilai dari sebuah variabel.',
                'block_shape'       => 'value',
                'parameter_schema'  => [
                    'variable' => ['type' => 'variable_name'],
                ],
                'sort_order'        => 2,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $variabel->id,
                'block_type'        => 'variable_change',
                'display_name'      => 'Ubah Variabel Sebesar',
                'description'       => 'Menambah atau mengurangi nilai variabel.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'variable' => ['type' => 'variable_name'],
                    'amount'   => ['type' => 'number', 'default' => 1],
                ],
                'sort_order'        => 3,
                'is_active'         => true,
            ],

            // ─── SENSOR ─────────────────────────────────────────────────────────
            [
                'block_category_id' => $sensor->id,
                'block_type'        => 'sensor_obstacle',
                'display_name'      => 'Ada Rintangan?',
                'description'       => 'Bernilai benar jika sensor ultrasonik mendeteksi rintangan di depan.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => null,
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $sensor->id,
                'block_type'        => 'sensor_line',
                'display_name'      => 'Mendeteksi Garis?',
                'description'       => 'Bernilai benar jika sensor garis mendeteksi garis di bawah robot.',
                'block_shape'       => 'boolean',
                'parameter_schema'  => [
                    'side' => ['type' => 'string', 'default' => 'kiri', 'options' => ['kiri', 'kanan', 'tengah']],
                ],
                'sort_order'        => 2,
                'is_active'         => true,
            ],

            // ─── TAMPILAN ───────────────────────────────────────────────────────
            [
                'block_category_id' => $tampilan->id,
                'block_type'        => 'display_text',
                'display_name'      => 'Tampilkan Teks',
                'description'       => 'Menampilkan teks pada layar simulator.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'text' => ['type' => 'string', 'default' => 'Halo!'],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $tampilan->id,
                'block_type'        => 'display_clear',
                'display_name'      => 'Bersihkan Layar',
                'description'       => 'Menghapus semua teks yang ditampilkan di layar simulator.',
                'block_shape'       => 'stack',
                'parameter_schema'  => null,
                'sort_order'        => 2,
                'is_active'         => true,
            ],

            // ─── SUARA ──────────────────────────────────────────────────────────
            [
                'block_category_id' => $suara->id,
                'block_type'        => 'sound_play_tone',
                'display_name'      => 'Mainkan Nada',
                'description'       => 'Memainkan nada dengan frekuensi dan durasi tertentu.',
                'block_shape'       => 'stack',
                'parameter_schema'  => [
                    'frequency' => ['type' => 'integer', 'default' => 440, 'min' => 100, 'max' => 4000],
                    'duration'  => ['type' => 'number', 'default' => 0.5, 'min' => 0.1, 'max' => 10],
                ],
                'sort_order'        => 1,
                'is_active'         => true,
            ],
            [
                'block_category_id' => $suara->id,
                'block_type'        => 'sound_stop',
                'display_name'      => 'Hentikan Suara',
                'description'       => 'Menghentikan semua suara yang sedang dimainkan.',
                'block_shape'       => 'stack',
                'parameter_schema'  => null,
                'sort_order'        => 2,
                'is_active'         => true,
            ],
        ];

        foreach ($definitions as $def) {
            BlockDefinition::updateOrCreate(
                ['block_type' => $def['block_type']],
                $def
            );
        }

        $this->command->info('BlockDefinition seeded: ' . count($definitions) . ' block definitions.');
    }
}
