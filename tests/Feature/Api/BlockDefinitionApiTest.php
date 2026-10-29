<?php

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('api returns list of all active block definitions', function () {
    $response = $this->getJson('/api/robokreasi/blocks');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ])
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'block_category_id',
                    'block_type',
                    'display_name',
                    'description',
                    'block_shape',
                    'parameter_schema',
                    'sort_order',
                ],
            ],
        ]);

    $blockTypes = collect($response->json('data'))->pluck('block_type')->all();
    expect($blockTypes)->toContain('event_start', 'motion_forward', 'control_repeat', 'sensor_obstacle');
});

test('api filters blocks by category slug', function () {
    $response = $this->getJson('/api/robokreasi/blocks?category=gerakan');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data)->not->toBeEmpty();
    foreach ($data as $block) {
        expect($block['block_type'])->toStartWith('motion_');
    }
});

test('api returns 404 if filtering by non existent category', function () {
    $response = $this->getJson('/api/robokreasi/blocks?category=kategori-gaib');

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
});
