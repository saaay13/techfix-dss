<?php

namespace App\Http\Controllers;

use App\Models\Component;
use App\Http\Requests\StoreComponentRequest;
use App\Http\Requests\UpdateComponentRequest;
use Illuminate\Http\JsonResponse;

class ComponentController extends Controller
{
    public function index()
    {
        $query = Component::with('category')
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->when(request('category_id'), fn($q, $v) => $q->where('category_id', $v))
            ->when(request()->has('activo'), fn($q) => $q->where('activo', request('activo')))
            ->orderBy('created_at', 'desc');

        $perPage = request('per_page');
        return response()->json($perPage ? $query->paginate($perPage) : $query->get());
    }

    public function store(StoreComponentRequest $request)
    {
        $component = Component::create($request->validated());
        return response()->json([
            'message' => 'Componente registrado exitosamente.',
            'component' => $component,
        ], 201);
    }

    public function show(Component $component)
    {
        return response()->json($component);
    }

    public function update(UpdateComponentRequest $request, Component $component)
    {
        $component->update($request->validated());
        return response()->json([
            'message' => 'Componente actualizado exitosamente.',
            'component' => $component,
        ]);
    }

    public function destroy(Component $component)
    {
        $component->delete();
        return response()->json([
            'message' => 'Componente eliminado exitosamente.',
        ]);
    }

    public function criticalStock(): JsonResponse
    {
        $components = Component::with('category')
            ->criticalStock()
            ->orderBy('cantidad')
            ->get();

        return response()->json($components);
    }
}
