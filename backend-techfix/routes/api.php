<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceOrderController;
use App\Http\Controllers\ServiceTypeController;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Conexión exitosa',
        'db' => DB::connection()->getDatabaseName(),
        'time' => now()->toDateTimeString(),
    ]);
});

Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('devices', DeviceController::class)->only(['index', 'show']);
Route::apiResource('clients', ClientController::class)->only(['index', 'show']);
Route::apiResource('service-types', ServiceTypeController::class)->only(['index', 'show']);
Route::apiResource('service-orders', ServiceOrderController::class)->only(['index', 'store', 'show']);
