<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrder;
use App\Models\ServiceOrderItem;
use App\Models\Payment;
use App\Models\Component;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'monthly_income' => $this->getMonthlyIncome(),
            'top_services' => $this->getTopServices(),
            'top_failed_devices' => $this->getTopFailedDevices(),
            'critical_stock' => $this->getCriticalStock(),
            'pending_orders_count' => $this->getPendingOrders(),
        ]);
    }

    private function getMonthlyIncome(): array
    {
        return Payment::select(
            DB::raw("DATE_FORMAT(fecha, '%Y-%m') as month"),
            DB::raw('SUM(monto) as total')
        )
        ->where('fecha', '>=', now()->subMonths(12))
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->toArray();
    }

    private function getTopServices(): array
    {
        return ServiceOrderItem::select('service_type_id', DB::raw('COUNT(*) as count'))
            ->groupBy('service_type_id')
            ->orderByDesc('count')
            ->limit(5)
            ->with('serviceType:id,nombre')
            ->get()
            ->map(fn($item) => [
                'nombre' => $item->serviceType->nombre ?? 'N/A',
                'count' => $item->count,
            ])
            ->toArray();
    }

    private function getTopFailedDevices(): array
    {
        return ServiceOrder::select('device_id', DB::raw('COUNT(*) as count'))
            ->groupBy('device_id')
            ->orderByDesc('count')
            ->limit(5)
            ->with('device:id,tipo_equipo,marca,modelo')
            ->get()
            ->map(fn($item) => [
                'nombre' => $item->device ? "{$item->device->marca} {$item->device->modelo}" : 'N/A',
                'count' => $item->count,
            ])
            ->toArray();
    }

    private function getCriticalStock(): int
    {
        return Component::criticalStock()->count();
    }

    private function getPendingOrders(): int
    {
        return ServiceOrder::where('estado', 'Diagnóstico')->count();
    }
}
