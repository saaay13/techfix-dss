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
                'serviceType',
                'user',
                'componentUsages.component',
                'activityLogs.activity',
                'activityLogs.user',
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
            ], 500);
        }
    }
}