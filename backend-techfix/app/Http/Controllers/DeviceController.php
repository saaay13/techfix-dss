<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Http\Requests\StoreDeviceRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class DeviceController extends Controller
{
    // HU-02: CRUD de equipos. El recepcionista registra el equipo con los
    // datos del cliente, tipo, marca, modelo y número de serie único.
    public function index()
    {
        $devices = Device::with('client')->orderBy('created_at', 'desc')->get();
        return response()->json($devices);
    }

    public function store(StoreDeviceRequest $request)
    {
        try {
            $device = Device::create($request->validated());
            $device->load('client');
            return response()->json([
                'message' => 'Equipo registrado exitosamente.',
                'device' => $device,
            ], 201);
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE constraint failed') ||
                str_contains($e->getMessage(), 'Duplicate entry')) {
                return response()->json([
                    'message' => 'El número de serie ya está registrado.',
                    'errors' => ['numero_serie' => ['Este número de serie ya existe en el sistema.']],
                ], 422);
            }
            return response()->json([
                'message' => 'Error al registrar el equipo.',
            ], 500);
        }
    }

    public function show(Device $device)
    {
        $device->load('client');
        return response()->json($device);
    }

    public function update(StoreDeviceRequest $request, Device $device)
    {
        try {
            $device->update($request->validated());
            $device->load('client');
            return response()->json([
                'message' => 'Equipo actualizado exitosamente.',
                'device' => $device,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al actualizar el equipo.',
            ], 500);
        }
    }

    public function destroy(Device $device)
    {
        $device->update(['activo' => false]);
        return response()->json([
            'message' => 'Equipo desactivado exitosamente.',
        ]);
    }
}
