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
            'client_id' => ['sometimes', 'required', 'integer', 'min:1', 'exists:clients,id'],
            'device_id' => ['sometimes', 'required', 'integer', 'min:1', 'exists:devices,id'],
            'service_type_id' => ['sometimes', 'required', 'integer', 'min:1', 'exists:service_types,id'],
            'diagnostico_inicial' => ['sometimes', 'required', 'string', 'max:2000'],
            'prioridad' => ['sometimes', 'required', 'string', Rule::in(['Baja', 'Media', 'Alta'])],
            'estado' => ['sometimes', 'required', 'string', Rule::in(['Recibido', 'Diagnóstico', 'En reparación', 'Finalizado', 'Entregado'])],
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
            'estado.required' => 'El estado es obligatorio.',
            'estado.in' => 'El estado debe ser: Recibido, Diagnóstico, En reparación, Finalizado o Entregado.',
            'fecha_estimada_entrega.after_or_equal' => 'La fecha estimada debe ser hoy o una fecha futura.',
        ];
    }
}
