<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\SensorDataController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth.firebase'])->group(function () {
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');

    Route::get('/dashboard', function () {
        return Inertia::render('Overview');
    })->name('dashboard');

    Route::get('/dashboard/manage-incubator', function () {
        return Inertia::render('ManageIncubator');
    })->name('dashboard.manage-incubator');

    // Route::get('/dashboard/manage-devices', function () {
    //     return Inertia::render('ManageDevices');
    // })->name('dashboard.manage-devices');

    // Route::get('/dashboard/manage-eggs', function () {
    //     return Inertia::render('ManageEggs');
    // })->name('dashboard.manage-eggs');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::middleware('auth')->group(function () {

// });


Route::middleware(['auth.firebase'])->group(function () {
    Route::get('api/sensor-data/history/{userId}/{incubatorId}', [SensorDataController::class, 'history'])
        ->name('sensor-data.history');
    Route::post('api/sensor-data/store-hourly/{userId}/{incubatorId}', [SensorDataController::class, 'storeHourly'])
        ->name('sensor-data.sensor-data');
    Route::post('api/sensor-data/store-daily/{userId}/{incubatorId}', [SensorDataController::class, 'storeDaily'])
        ->name('sensor-data.sensor-data');
    Route::post('api/sensor-data/store-weekly/{userId}/{incubatorId}', [SensorDataController::class, 'storeWeekly'])
        ->name('sensor-data.sensor-data');

});


require __DIR__ . '/auth.php';
