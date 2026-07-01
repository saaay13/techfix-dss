<?php

namespace App\Http\Controllers;

use App\Models\ComponentSwap;
use App\Models\SwapDetail;
use App\Http\Requests\StoreComponentSwapRequest;
use Illuminate\Database\QueryException;

class ComponentSwapController extends Controller
{
    public function index()
    {
        $swaps = ComponentSwap::with(['serviceOrder.client', 'swapDetails.component'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($swaps);
    }

    public function store(StoreComponentSwapRequest $request)
    {
        try {
            $data = $request->validated();

            $swap = ComponentSwap::create([
                'service_order_id' => $data['service_order_id'],
                'observaciones' => $data['observaciones'] ?? null,
                'devuelto_al_cliente' => $data['devuelto_al_cliente'] ?? false,
            ]);

            SwapDetail::create([
                'component_swap_id' => $swap->id,
                'component_id' => $data['retirado_component_id'],
                'tipo' => 'retirado',
                'cantidad' => $data['retirado_cantidad'],
            ]);

            SwapDetail::create([
                'component_swap_id' => $swap->id,
                'component_id' => $data['instalado_component_id'],
                'tipo' => 'instalado',
                'cantidad' => $data['instalado_cantidad'],
            ]);

            $swap->load(['serviceOrder.client', 'swapDetails.component']);

            return response()->json([
                'message' => 'Cambio de componente registrado exitosamente.',
                'component_swap' => $swap,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al registrar el cambio de componente.',
            ], 500);
        }
    }

    public function show(ComponentSwap $componentSwap)
    {
        $componentSwap->load(['serviceOrder.client', 'swapDetails.component']);
        return response()->json($componentSwap);
    }
}
