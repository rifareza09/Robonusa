<?php

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('api returns active guides with ordered steps', function () {
    $response = $this->getJson('/api/robokreasi/guides');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ])
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'steps' => [
                        '*' => [
                            'id',
                            'guide_id',
                            'step_number',
                            'title',
                            'instruction',
                            'target_element',
                        ],
                    ],
                ],
            ],
        ]);

    $steps = $response->json('data.0.steps');
    expect($steps)->toHaveCount(8);
    // Verifikasi urutan langkah 1, 2, 3 ...
    for ($i = 0; $i < count($steps); $i++) {
        expect($steps[$i]['step_number'])->toBe($i + 1);
    }
});

test('api returns single guide by ID', function () {
    $guideId = \App\Models\Guide::first()->id;

    $response = $this->getJson("/api/robokreasi/guides/{$guideId}");

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data'    => [
                'id' => $guideId,
            ],
        ]);

    expect($response->json('data.steps'))->not->toBeEmpty();
});

test('api returns 404 for non existent guide ID', function () {
    $response = $this->getJson('/api/robokreasi/guides/99999');

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
});

test('api returns 422 for non integer guide ID', function () {
    $response = $this->getJson('/api/robokreasi/guides/abc');

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
        ]);
});
