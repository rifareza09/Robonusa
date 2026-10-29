<?php

use App\Models\BlockCategory;
use App\Models\BlockDefinition;
use App\Models\ExampleProject;
use App\Models\Guide;
use App\Models\GuideStep;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('database seeder can be executed repeatedly without generating duplicate records', function () {
    // Jalankan seeder pertama kali
    $this->seed(DatabaseSeeder::class);

    $categoryCount1 = BlockCategory::count();
    $blockCount1    = BlockDefinition::count();
    $projectCount1  = ExampleProject::count();
    $guideCount1    = Guide::count();
    $stepCount1     = GuideStep::count();

    expect($categoryCount1)->toBe(8);
    expect($blockCount1)->toBe(30);
    expect($projectCount1)->toBe(3);
    expect($guideCount1)->toBe(1);
    expect($stepCount1)->toBe(8);

    // Jalankan seeder kedua kali (idempotensi)
    $this->seed(DatabaseSeeder::class);

    expect(BlockCategory::count())->toBe($categoryCount1);
    expect(BlockDefinition::count())->toBe($blockCount1);
    expect(ExampleProject::count())->toBe($projectCount1);
    expect(Guide::count())->toBe($guideCount1);
    expect(GuideStep::count())->toBe($stepCount1);
});

test('eloquent relationships function correctly', function () {
    $this->seed(DatabaseSeeder::class);

    // 1. Relasi Kategori -> Blok
    $category = BlockCategory::where('slug', 'gerakan')->first();
    expect($category)->not->toBeNull();
    expect($category->blockDefinitions)->not->toBeEmpty();
    expect($category->blockDefinitions->first())->toBeInstanceOf(BlockDefinition::class);

    // 2. Relasi Blok -> Kategori
    $block = BlockDefinition::where('block_type', 'motion_forward')->first();
    expect($block)->not->toBeNull();
    expect($block->blockCategory)->toBeInstanceOf(BlockCategory::class);
    expect($block->blockCategory->slug)->toBe('gerakan');

    // 3. Relasi Panduan -> Langkah
    $guide = Guide::first();
    expect($guide)->not->toBeNull();
    expect($guide->steps)->toHaveCount(8);
    expect($guide->steps->first())->toBeInstanceOf(GuideStep::class);

    // 4. Relasi Langkah -> Panduan
    $step = GuideStep::first();
    expect($step->guide)->toBeInstanceOf(Guide::class);

    // 5. Casts workspace_json & parameter_schema ke array
    $project = ExampleProject::where('slug', 'robot-pemilih-jalur')->first();
    expect($project->workspace_json)->toBeArray();
    expect($block->parameter_schema)->toBeArray();
});
