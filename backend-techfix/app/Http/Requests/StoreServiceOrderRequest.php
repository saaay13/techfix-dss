<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceOrderRequest extends FormRequest
{
    // HU-04: Valida que existan cliente, equipo y tipo de servicio en BD.
    // La prioridad solo acepta Baja, Media o Alta. Fecha estimada futura.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'integer', 'min:1', 'exists:clients,id'],
            'device_id' => ['required', 'integer', 'min:1', 'exists:devices,id'],
            'service_type_id' => ['required', 'integer', 'min:1', 'exists:service_types,id'],
            'diagnostico_inicial' => ['required', 'string', 'max:2000'],
            'prioridad' => ['required', 'string', Rule::in(['Baja', 'Media', 'Alta'])],
            'fecha_estimada_entrega' => ['nullable', 'date', 'after_or_equal:today'],
            'observaciones' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'Debe seleccionar un cliente.',
            'client_id.exists' => 'El cliente seleccionado no existe.',
            'device_id.required' => 'Debe seleccionar un equipo.',
            'device_id.exists' => 'El equipo seleccionado no existe.',
            'service_type_id.required' => 'Debe seleccionar un tipo de servicio.',
            'service_type_id.exists' => 'El tipo de servicio seleccionado no existe.',
            'diagnostico_inicial.required' => 'El diagnóstico inicial es obligatorio.',
            'prioridad.required' => 'La prioridad es obligatoria.',
            'prioridad.in' => 'La prioridad debe ser Baja, Media o Alta.',
            'fecha_estimada_entrega.after_or_equal' => 'La fecha estimada debe ser hoy o una fecha futura.',
        ];
    }
}
