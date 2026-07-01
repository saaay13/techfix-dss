<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_order_id' => ['required', 'integer', 'min:1', 'exists:service_orders,id'],
            'monto' => ['required', 'numeric', 'min:0.01'],
            'metodo_pago' => ['required', 'string', Rule::in(['Efectivo', 'Transferencia', 'Tarjeta', 'QR'])],
        ];
    }

    public function messages(): array
    {
        return [
            'service_order_id.required' => 'Debe seleccionar una orden de servicio.',
            'service_order_id.exists' => 'La orden de servicio no existe.',
            'monto.required' => 'El monto es obligatorio.',
            'monto.numeric' => 'El monto debe ser un valor numérico.',
            'monto.min' => 'El monto debe ser mayor a cero.',
            'metodo_pago.required' => 'El método de pago es obligatorio.',
            'metodo_pago.in' => 'El método de pago debe ser: Efectivo, Transferencia, Tarjeta o QR.',
        ];
    }
}
