<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrder;
use App\Models\Payment;
use App\Models\Component;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $monthlyIncome = $this->getMonthlyIncome();
        $topServices = $this->getTopServices();
        $topFailedDevices = $this->getTopFailedDevices();
        $criticalStock = $this->getCriticalStock();
        $pendingOrders = $this->getPendingOrders();

        return response()->json([
            'monthly_income' => $monthlyIncome,
            'top_services' => $topServices,
            'top_failed_devices' => $topFailedDevices,
            'critical_stock' => $criticalStock,
            'pending_orders_count' => $pendingOrders,
        ]);
    }

    private function getMonthlyIncome(): array
    {
        return Payment::select(
            DB::raw("strftime('%Y-%m', fecha) as month"),
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
        return ServiceOrder::select('service_type_id', DB::raw('COUNT(*) as count'))
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
        return ServiceOrder::where('estado', 'Pendiente')->count();
    }
}
