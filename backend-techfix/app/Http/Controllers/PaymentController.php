<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ServiceOrder;
use App\Http\Requests\StorePaymentRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('serviceOrder.client')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($payments);
    }

    public function store(StorePaymentRequest $request)
    {
        try {
            $order = ServiceOrder::findOrFail($request->service_order_id);

            $totalPagado = $order->payments()->sum('monto');
            $saldoRestante = $order->costo_total - $totalPagado;

            if ($request->monto > $saldoRestante) {
                return response()->json([
                    'message' => 'El pago excede el saldo restante.',
                    'errors' => [
                        'monto' => ["El monto máximo permitido es Bs. {$saldoRestante}"],
                    ],
                ], 422);
            }

            $data = $request->validated();
            $data['fecha'] = now()->toDateString();

            $payment = Payment::create($data);
            $payment->load('serviceOrder.client');

            return response()->json([
                'message' => 'Pago registrado exitosamente.',
                'payment' => $payment,
                'total_pagado' => $totalPagado + $payment->monto,
                'saldo_restante' => $saldoRestante - $payment->monto,
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'La orden de servicio no existe.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al registrar el pago.',
            ], 500);
        }
    }

    public function show(Payment $payment)
    {
        $payment->load('serviceOrder.client');
        return response()->json($payment);
    }

    public function byOrder(ServiceOrder $serviceOrder)
    {
        $payments = $serviceOrder->payments()->orderBy('created_at', 'desc')->get();
        $totalPagado = $payments->sum('monto');
        $saldoRestante = $serviceOrder->costo_total - $totalPagado;

        return response()->json([
            'payments' => $payments,
            'total_pagado' => $totalPagado,
            'saldo_restante' => $saldoRestante,
            'costo_total' => $serviceOrder->costo_total,
        ]);
    }
}
