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
            'diagnostico_inicial' => ['sometimes', 'string', 'max:2000'],
            'prioridad' => ['sometimes', 'string', Rule::in(['Baja', 'Media', 'Alta'])],
            'fecha_estimada_entrega' => ['nullable', 'date'],
            'observaciones' => ['nullable', 'string', 'max:2000'],
            'costo_total' => ['sometimes', 'numeric', 'min:0'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.service_type_id' => ['required_with:items', 'integer', 'exists:service_types,id'],
            'items.*.descripcion' => ['nullable', 'string', 'max:500'],
            'items.*.precio' => ['required_with:items', 'numeric', 'min:0'],
        ];
    }
}
