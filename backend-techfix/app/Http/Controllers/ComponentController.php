<?php

namespace App\Http\Controllers;

use App\Models\Component;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    public function index()
    {
        $components = Component::where('activo', true)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json($components);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'nullable|string',
            'cantidad'       => 'required|integer|min:1',
            'stock_minimo'   => 'nullable|integer|min:0',
            'precio_unitario'=> 'required|numeric|min:0',
            'category_id'    => 'nullable|exists:categories,id',
        ]);

        $component = Component::create($validated);

        return response()->json($component, 201);
    }
}
