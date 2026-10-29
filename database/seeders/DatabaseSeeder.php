<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Urutan seeder penting:
     * 1. BlockCategorySeeder harus dijalankan sebelum BlockDefinitionSeeder
     *    karena definisi blok membutuhkan foreign key ke kategori.
     * 2. GuideSeeder harus dijalankan sebelum atau setelah proyek (tidak ada dependensi).
     */
    public function run(): void
    {
        $this->call([
            BlockCategorySeeder::class,
            BlockDefinitionSeeder::class,
            ExampleProjectSeeder::class,
            GuideSeeder::class,
        ]);
    }
}
