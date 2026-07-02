<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrder;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ServiceOrderPdfController extends Controller
{
    public function generatePdf(int $id)
    {
        try {
            $order = ServiceOrder::with([
                'client',
                'device',
                'user',
                'items.serviceType',
                'items.activityLogs.activity',
                'items.activityLogs.user',
                'componentUsages.component',
            ])->findOrFail($id);

            $pdf = Pdf::loadView('pdf.service-order', [
                'order' => $order,
            ]);

            return $pdf->download("hoja-servicio-{$order->id}.pdf");
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Orden de servicio no encontrada.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar el PDF.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
