<?php

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('api returns list of active categories', function () {
    $response = $this->getJson('/api/robokreasi/categories');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ])
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'slug',
                    'description',
                    'color_hex',
                    'sort_order',
                ],
            ],
        ]);

    // Memastikan 8 kategori platform utama ada
    $names = collect($response->json('data'))->pluck('name')->all();
    expect($names)->toContain('Kejadian', 'Gerakan', 'Kontrol', 'Operator', 'Variabel', 'Sensor', 'Tampilan', 'Suara');
});

test('api returns categories with nested blocks when include_blocks is true', function () {
    $response = $this->getJson('/api/robokreasi/categories?include_blocks=true');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'block_definitions' => [
                        '*' => [
                            'id',
                            'block_type',
                            'display_name',
                            'block_shape',
                        ],
                    ],
                ],
            ],
        ]);
});
