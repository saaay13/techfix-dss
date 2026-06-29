<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrder;
use App\Http\Requests\StoreServiceOrderRequest;
use App\Http\Requests\UpdateServiceOrderRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class ServiceOrderController extends Controller
{
    public function index()
    {
        $orders = ServiceOrder::with(['client', 'device', 'serviceType', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }

    public function store(StoreServiceOrderRequest $request)
    {
        try {
            $data = $request->validated();
            $data['estado'] = 'Recibido';
            $data['fecha_ingreso'] = now()->toDateString();
            $data['costo_total'] = 0;
            $data['user_id'] = auth()->id();

            $order = ServiceOrder::create($data);
            $order->load(['client', 'device', 'serviceType', 'user']);

            return response()->json([
                'message' => 'Orden de servicio creada exitosamente.',
                'service_order' => $order,
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Cliente o equipo no encontrado.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al crear la orden de servicio.',
            ], 500);
        }
    }

    public function show(ServiceOrder $serviceOrder)
    {
        $serviceOrder->load(['client', 'device', 'serviceType', 'user']);
        return response()->json($serviceOrder);
    }

    public function update(UpdateServiceOrderRequest $request, ServiceOrder $serviceOrder)
    {
        try {
            $data = $request->validated();
            $serviceOrder->update($data);
            $serviceOrder->load(['client', 'device', 'serviceType', 'user']);

            return response()->json([
                'message' => 'Orden de servicio actualizada exitosamente.',
                'service_order' => $serviceOrder,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al actualizar la orden de servicio.',
            ], 500);
        }
    }

    public function updateStatus(Request $request, ServiceOrder $serviceOrder)
    {
        $validTransitions = [
            'Recibido' => 'Diagnóstico',
            'Diagnóstico' => 'En reparación',
            'En reparación' => 'Finalizado',
            'Finalizado' => 'Entregado',
        ];

        $request->validate([
            'nota' => ['required_if:estado_nuevo,En reparación,Finalizado', 'string', 'max:1000'],
        ]);

        $nuevoEstado = $request->estado_nuevo;
        $estadoActual = $serviceOrder->estado;
        $siguienteEstado = $validTransitions[$estadoActual] ?? null;

        if (!$siguienteEstado) {
            return response()->json([
                'message' => "La orden ya está en estado final '{$estadoActual}'.",
            ], 422);
        }

        if ($nuevoEstado !== $siguienteEstado) {
            return response()->json([
                'message' => "No se puede cambiar de '{$estadoActual}' a '{$nuevoEstado}'. El siguiente estado permitido es '{$siguienteEstado}'.",
            ], 422);
        }

        $serviceOrder->update(['estado' => $nuevoEstado]);
        $serviceOrder->load(['client', 'device', 'serviceType', 'user']);

        return response()->json([
            'message' => "Estado actualizado a '{$nuevoEstado}'.",
            'service_order' => $serviceOrder,
            'nota' => $request->nota,
        ]);
    }

    public function destroy(ServiceOrder $serviceOrder)
    {
        $serviceOrder->delete();
        return response()->json([
            'message' => 'Orden de servicio eliminada exitosamente.',
        ]);
    }
}
