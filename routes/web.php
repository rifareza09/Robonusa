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

Route::get('/robokreasi', [RoboKreasiController::class, 'workspace'])->name('robokreasi.workspace');
