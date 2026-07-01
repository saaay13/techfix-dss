<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;

class ServiceTypeController extends Controller
{
    public function index()
    {
        return response()->json(ServiceType::orderBy('nombre')->get());
    }

    public function store(StoreServiceTypeRequest $request)
    {
        $type = ServiceType::create($request->validated());
        return response()->json([
            'message' => 'Tipo de servicio creado exitosamente.',
            'service_type' => $type,
        ], 201);
    }

    public function show(ServiceType $serviceType)
    {
        return response()->json($serviceType);
    }

    public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType)
    {
        $serviceType->update($request->validated());
        return response()->json([
            'message' => 'Tipo de servicio actualizado exitosamente.',
            'service_type' => $serviceType,
        ]);
    }

    public function destroy(ServiceType $serviceType)
    {
        $serviceType->update(['activo' => false]);
        return response()->json([
            'message' => 'Tipo de servicio desactivado exitosamente.',
        ]);
    }
}
