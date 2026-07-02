<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;

class ServiceTypeController extends Controller
{
    public function index()
    {
        $query = ServiceType::query()
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->when(request()->has('activo'), fn($q) => $q->where('activo', request('activo')))
            ->orderBy('nombre');

        $perPage = request('per_page');
        return response()->json($perPage ? $query->paginate($perPage) : $query->get());
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
