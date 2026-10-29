<?php

namespace Database\Seeders;

use App\Models\BlockCategory;
use Illuminate\Database\Seeder;

class BlockCategorySeeder extends Seeder
{
    /**
     * Seed kategori blok.
     * Dapat dijalankan ulang tanpa duplikasi (menggunakan firstOrCreate + update).
     */
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Kejadian',
                'slug'        => 'kejadian',
                'description' => 'Blok pemicu program, menentukan kapan program mulai berjalan.',
                'color_hex'   => '#FFAB19',
                'sort_order'  => 1,
                'is_active'   => true,
            ],
            [
                'name'        => 'Gerakan',
                'slug'        => 'gerakan',
                'description' => 'Blok untuk mengontrol pergerakan robot maju, mundur, dan berputar.',
                'color_hex'   => '#4C97FF',
                'sort_order'  => 2,
                'is_active'   => true,
            ],
            [
                'name'        => 'Kontrol',
                'slug'        => 'kontrol',
                'description' => 'Blok pengulangan, percabangan, dan alur kendali program.',
                'color_hex'   => '#FFAB19',
                'sort_order'  => 3,
                'is_active'   => true,
            ],
            [
                'name'        => 'Operator',
                'slug'        => 'operator',
                'description' => 'Blok operasi matematika dan logika.',
                'color_hex'   => '#40BF4A',
                'sort_order'  => 4,
                'is_active'   => true,
            ],
            [
                'name'        => 'Variabel',
                'slug'        => 'variabel',
                'description' => 'Blok untuk menyimpan dan membaca nilai variabel.',
                'color_hex'   => '#FF8C1A',
                'sort_order'  => 5,
                'is_active'   => true,
            ],
            [
                'name'        => 'Sensor',
                'slug'        => 'sensor',
                'description' => 'Blok pembacaan sensor robot: sensor rintangan dan sensor garis.',
                'color_hex'   => '#5CB1D6',
                'sort_order'  => 6,
                'is_active'   => true,
            ],
            [
                'name'        => 'Tampilan',
                'slug'        => 'tampilan',
                'description' => 'Blok untuk menampilkan teks atau informasi di layar simulator.',
                'color_hex'   => '#9966FF',
                'sort_order'  => 7,
                'is_active'   => true,
            ],
            [
                'name'        => 'Suara',
                'slug'        => 'suara',
                'description' => 'Blok untuk memainkan nada atau menghentikan suara pada simulator.',
                'color_hex'   => '#CF63CF',
                'sort_order'  => 8,
                'is_active'   => true,
            ],
        ];

        foreach ($categories as $categoryData) {
            BlockCategory::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $this->command->info('BlockCategory seeded: ' . count($categories) . ' categories.');
    }
}
