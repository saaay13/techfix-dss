<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ServiceOrderController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\ActivityController;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Conexión exitosa',
        'db' => DB::connection()->getDatabaseName(),
        'time' => now()->toDateTimeString(),
    ]);
});

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('devices', DeviceController::class);
    Route::apiResource('service-types', ServiceTypeController::class)->only(['index', 'show']);
    Route::apiResource('service-orders', ServiceOrderController::class);
    Route::put('service-orders/{service_order}/status', [ServiceOrderController::class, 'updateStatus']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::get('/components/critical-stock', [ComponentController::class, 'criticalStock']);
    Route::apiResource('components', ComponentController::class);

    Route::middleware('role:Administrador')->group(function () {
        Route::apiResource('activities', ActivityController::class);
        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::post('service-types', [ServiceTypeController::class, 'store']);
        Route::put('service-types/{service_type}', [ServiceTypeController::class, 'update']);
        Route::delete('service-types/{service_type}', [ServiceTypeController::class, 'destroy']);
        Route::get('/reports/financial', function () {
            return response()->json(['message' => 'Reportes financieros']);
        });
        Route::get('/dashboard/income', function () {
            return response()->json(['message' => 'Dashboard de ingresos']);
        });
    });
});
