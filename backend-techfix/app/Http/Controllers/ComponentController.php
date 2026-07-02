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
        $components = Component::with('category')->orderBy('created_at', 'desc')->get();
        return response()->json($components);
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
