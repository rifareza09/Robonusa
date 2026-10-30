<?php

use App\Http\Controllers\RoboKreasiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes RoboKreasi
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('robokreasi.workspace');
});

Route::get('/beranda', [RoboKreasiController::class, 'home'])->name('robokreasi.home');
Route::get('/contoh-proyek', [RoboKreasiController::class, 'exampleProjects'])->name('robokreasi.example-projects');
Route::get('/robokreasi', [RoboKreasiController::class, 'workspace'])->name('robokreasi.workspace');
