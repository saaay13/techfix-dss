<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrder;
use App\Models\ServiceOrderItem;
use App\Models\ServiceType;
use App\Models\StatusHistory;
use App\Models\ActivityLog;
use App\Models\Activity;
use App\Http\Requests\StoreServiceOrderRequest;
use App\Http\Requests\UpdateServiceOrderRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class ServiceOrderController extends Controller
{
    public function index()
    {
        $orders = ServiceOrder::with(['client', 'device', 'user', 'items.serviceType'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }

    public function store(StoreServiceOrderRequest $request)
    {
        try {
            $itemsData = $request->input('items', []);
            $data = $request->safe()->except(['items']);
            $data['estado'] = 'Recibido';
            $data['fecha_ingreso'] = now()->toDateString();
            $data['user_id'] = auth()->id();
            $data['costo_total'] = collect($itemsData)->sum('precio');

            $order = ServiceOrder::create($data);

            foreach ($itemsData as $item) {
                $order->items()->create([
                    'service_type_id' => $item['service_type_id'],
                    'descripcion' => $item['descripcion'] ?? null,
                    'precio' => $item['precio'],
                ]);
            }

            $order->load(['client', 'device', 'user', 'items.serviceType']);

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
        $serviceOrder->load(['client', 'device', 'user', 'items.serviceType']);
        return response()->json($serviceOrder);
    }

    public function update(UpdateServiceOrderRequest $request, ServiceOrder $serviceOrder)
    {
        try {
            $itemsData = $request->input('items');
            $data = $request->safe()->except(['items']);

            if ($itemsData !== null) {
                $data['costo_total'] = collect($itemsData)->sum('precio');
                $serviceOrder->items()->delete();
                foreach ($itemsData as $item) {
                    $serviceOrder->items()->create([
                        'service_type_id' => $item['service_type_id'],
                        'descripcion' => $item['descripcion'] ?? null,
                        'precio' => $item['precio'],
                    ]);
                }
            }

            $serviceOrder->update($data);
            $serviceOrder->load(['client', 'device', 'user', 'items.serviceType']);

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
            'estado_nuevo' => ['required', 'string'],
        ]);

        if (in_array($request->estado_nuevo, ['En reparación', 'Finalizado'])) {
            $request->validate(['nota' => ['required', 'string', 'max:1000']]);
        }

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

        StatusHistory::create([
            'service_order_id' => $serviceOrder->id,
            'estado_anterior' => $estadoActual,
            'estado_nuevo' => $nuevoEstado,
            'nota' => $request->nota,
            'user_id' => auth()->id(),
        ]);

        $serviceOrder->load(['client', 'device', 'user', 'items.serviceType']);

        return response()->json([
            'message' => "Estado actualizado a '{$nuevoEstado}'.",
            'service_order' => $serviceOrder,
        ]);
    }

    public function storeActivity(Request $request, ServiceOrder $serviceOrder)
    {
        $validated = $request->validate([
            'activity_id' => 'required|integer|exists:activities,id',
            'descripcion_personalizada' => 'nullable|string|max:500',
        ]);

        $item = $serviceOrder->items()->first();

        if (!$item) {
            return response()->json([
                'message' => 'La orden no tiene servicios asociados. Agregue un servicio antes de registrar actividades.',
            ], 422);
        }

        $activity = Activity::findOrFail($validated['activity_id']);

        $log = ActivityLog::create([
            'service_order_item_id' => $item->id,
            'activity_id' => $activity->id,
            'user_id' => auth()->id(),
            'descripcion_personalizada' => $validated['descripcion_personalizada'] ?? null,
        ]);

        $log->load(['activity', 'user']);

        return response()->json([
            'message' => 'Actividad registrada exitosamente.',
            'activity_log' => $log,
        ], 201);
    }

    public function destroy(ServiceOrder $serviceOrder)
    {
        $serviceOrder->delete();
        return response()->json([
            'message' => 'Orden de servicio eliminada exitosamente.',
        ]);
    }
}
