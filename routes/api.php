<?php

use App\Http\Controllers\Api\BlockCategoryController;
use App\Http\Controllers\Api\BlockDefinitionController;
use App\Http\Controllers\Api\ExampleProjectController;
use App\Http\Controllers\Api\GuideController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes RoboKreasi
|--------------------------------------------------------------------------
| Endpoint resmi untuk data platform RoboKreasi:
| - GET /api/robokreasi/categories
| - GET /api/robokreasi/blocks
| - GET /api/robokreasi/example-projects
| - GET /api/robokreasi/example-projects/{slug}
| - GET /api/robokreasi/guides
| - GET /api/robokreasi/guides/{id}
*/

Route::prefix('robokreasi')->group(function () {
    Route::get('/categories', [BlockCategoryController::class, 'index'])->name('api.robokreasi.categories');
    Route::get('/blocks', [BlockDefinitionController::class, 'index'])->name('api.robokreasi.blocks');
    Route::get('/example-projects', [ExampleProjectController::class, 'index'])->name('api.robokreasi.example-projects');
    Route::get('/example-projects/{slug}', [ExampleProjectController::class, 'show'])->name('api.robokreasi.example-projects.show');
    Route::get('/guides', [GuideController::class, 'index'])->name('api.robokreasi.guides');
    Route::get('/guides/{id}', [GuideController::class, 'show'])->name('api.robokreasi.guides.show');
});
