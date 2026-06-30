<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['sometimes', 'integer', 'min:1', 'exists:clients,id'],
            'device_id' => ['sometimes', 'integer', 'min:1', 'exists:devices,id'],
            'service_type_id' => ['sometimes', 'integer', 'min:1', 'exists:service_types,id'],
            'diagnostico_inicial' => ['sometimes', 'string', 'max:2000'],
            'prioridad' => ['sometimes', 'string', Rule::in(['Baja', 'Media', 'Alta'])],
            'fecha_estimada_entrega' => ['nullable', 'date'],
            'observaciones' => ['nullable', 'string', 'max:2000'],
            'costo_total' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
