<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Http\Requests\StoreDeviceRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class DeviceController extends Controller
{
    public function index()
    {
        $query = Device::with('client')
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->when(request('client_id'), fn($q, $v) => $q->where('client_id', $v))
            ->when(request('estado_fisico'), fn($q, $v) => $q->where('estado_fisico', $v))
            ->when(request()->has('activo'), fn($q) => $q->where('activo', request('activo')))
            ->orderBy('created_at', 'desc');

        $perPage = request('per_page');
        return response()->json($perPage ? $query->paginate($perPage) : $query->get());
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

    public function serviceHistory(Device $device)
    {
        $orders = $device->serviceOrders()
            ->with('items.serviceType')
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return response()->json($orders);
    }
}
