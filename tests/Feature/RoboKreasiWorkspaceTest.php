<?php

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

test('workspace route renders RoboKreasi/Workspace with required props', function () {
    $response = $this->get('/robokreasi');

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('RoboKreasi/Workspace')
        ->has('blockCategories')
        ->has('blockDefinitions')
        ->has('exampleProjects')
        ->has('guides')
        ->where('blockCategories.0.name', 'Kejadian')
    );
});
