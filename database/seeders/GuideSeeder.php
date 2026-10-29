<?php

namespace Database\Seeders;

use App\Models\Guide;
use App\Models\GuideStep;
use Illuminate\Database\Seeder;

class GuideSeeder extends Seeder
{
    /**
     * Seed data panduan interaktif beserta langkah-langkahnya.
     * Dapat dijalankan ulang tanpa duplikasi (menggunakan title sebagai kunci unik per panduan).
     *
     * target_element menggunakan CSS selector / ID elemen UI yang harus
     * disepakati dengan Developer A (frontend) yang membuat komponen onboarding.
     */
    public function run(): void
    {
        $guides = [
            [
                'title'       => 'Panduan Memulai RoboKreasi',
                'description' => 'Kenalan dengan area-area utama RoboKreasi dan cara menggunakannya langkah demi langkah.',
                'is_active'   => true,
                'steps'       => [
                    [
                        'step_number'    => 1,
                        'title'          => 'Area Kategori Blok',
                        'instruction'    => 'Di sebelah kiri terdapat panel kategori blok. Setiap kategori memiliki warna berbeda dan berisi blok-blok yang berkaitan. Klik salah satu kategori untuk melihat blok di dalamnya.',
                        'target_element' => '#block-category-panel',
                    ],
                    [
                        'step_number'    => 2,
                        'title'          => 'Cara Mengambil Blok',
                        'instruction'    => 'Klik dan tahan blok yang ingin kamu gunakan, lalu seret ke area workspace di tengah layar. Lepaskan blok di posisi yang kamu inginkan.',
                        'target_element' => '#blockly-toolbox',
                    ],
                    [
                        'step_number'    => 3,
                        'title'          => 'Cara Menyusun Blok',
                        'instruction'    => 'Sambungkan blok-blok dengan mendekatkan satu blok ke blok lainnya. Blok akan terkunci otomatis saat cocok. Mulailah dengan blok "Ketika Program Mulai" sebagai titik awal programmu.',
                        'target_element' => '#blockly-workspace',
                    ],
                    [
                        'step_number'    => 4,
                        'title'          => 'Cara Menjalankan Program',
                        'instruction'    => 'Setelah selesai menyusun blok, klik tombol "Jalankan" (▶) untuk memulai program. Simulator robot akan menjalankan instruksi sesuai urutan blok yang kamu susun.',
                        'target_element' => '#btn-run-program',
                    ],
                    [
                        'step_number'    => 5,
                        'title'          => 'Cara Membaca Simulator',
                        'instruction'    => 'Perhatikan panel simulator di sebelah kanan. Robot akan bergerak sesuai instruksi. Ikon sensor akan menyala saat sensor aktif, dan teks akan muncul di layar jika program menggunakan blok Tampilan.',
                        'target_element' => '#robot-simulator',
                    ],
                    [
                        'step_number'    => 6,
                        'title'          => 'Cara Menghentikan Program',
                        'instruction'    => 'Klik tombol "Hentikan" (■) untuk menghentikan program yang sedang berjalan. Robot akan berhenti dan simulator akan mereset ke posisi awal.',
                        'target_element' => '#btn-stop-program',
                    ],
                    [
                        'step_number'    => 7,
                        'title'          => 'Cara Menyimpan Proyek',
                        'instruction'    => 'Klik tombol "Simpan" untuk mengunduh proyek kamu sebagai file JSON ke komputer. File ini bisa kamu buka kembali kapan saja.',
                        'target_element' => '#btn-save-project',
                    ],
                    [
                        'step_number'    => 8,
                        'title'          => 'Cara Membuka Proyek',
                        'instruction'    => 'Klik tombol "Buka" lalu pilih file JSON proyek yang pernah kamu simpan. Workspace akan dimuat ulang dengan proyek tersebut.',
                        'target_element' => '#btn-open-project',
                    ],
                ],
            ],
        ];

        foreach ($guides as $guideData) {
            $steps = $guideData['steps'];
            unset($guideData['steps']);

            /** @var Guide $guide */
            $guide = Guide::updateOrCreate(
                ['title' => $guideData['title']],
                $guideData
            );

            foreach ($steps as $stepData) {
                GuideStep::updateOrCreate(
                    [
                        'guide_id'    => $guide->id,
                        'step_number' => $stepData['step_number'],
                    ],
                    array_merge($stepData, ['guide_id' => $guide->id])
                );
            }
        }

        $totalSteps = array_sum(array_map(fn ($g) => count($g['steps']), $guides));
        $this->command->info('Guide seeded: ' . count($guides) . ' guides, ' . $totalSteps . ' steps.');
    }
}
