<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\ClientController;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Conexión exitosa',
        'db' => DB::connection()->getDatabaseName(),
        'time' => now()->toDateTimeString(),
    ]);
});

Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('devices', DeviceController::class);
Route::apiResource('clients', ClientController::class);
