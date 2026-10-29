<?php

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('api returns list of active example projects', function () {
    $response = $this->getJson('/api/robokreasi/example-projects');

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
                    'difficulty',
                    'thumbnail',
                    'workspace_json',
                    'sort_order',
                ],
            ],
        ]);

    $names = collect($response->json('data'))->pluck('name')->all();
    expect($names)->toContain(
        'Robot Pemilih Jalur',
        'Algoritma Menghindari Rintangan Virtual',
        'Program Hitung Mundur Interaktif'
    );
});

test('api filters example projects by difficulty', function () {
    $response = $this->getJson('/api/robokreasi/example-projects?difficulty=pemula');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data)->not->toBeEmpty();
    foreach ($data as $project) {
        expect($project['difficulty'])->toBe('pemula');
    }
});

test('api returns 422 for invalid difficulty filter', function () {
    $response = $this->getJson('/api/robokreasi/example-projects?difficulty=expert');

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
        ]);
});

test('api returns example project detail with valid workspace_json by slug', function () {
    $response = $this->getJson('/api/robokreasi/example-projects/robot-pemilih-jalur');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data'    => [
                'slug'       => 'robot-pemilih-jalur',
                'difficulty' => 'pemula',
            ],
        ]);

    $workspace = $response->json('data.workspace_json');
    expect($workspace)->toBeArray();
    expect($workspace)->toHaveKey('blocks');
    expect($workspace['blocks'])->toHaveKey('blocks');
});

test('api returns 404 for unknown project slug', function () {
    $response = $this->getJson('/api/robokreasi/example-projects/proyek-tidak-ada');

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
});

test('api returns 422 for invalid slug format', function () {
    $response = $this->getJson('/api/robokreasi/example-projects/INVALID_SLUG_WITH_UNDERSCORE_AND_CAPS!');

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
        ]);
});
