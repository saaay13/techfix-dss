<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeviceRequest extends FormRequest
{
    // HU-02: Valida campos obligatorios del equipo (tipo, marca, modelo, serie).
    // El número de serie debe ser único para evitar duplicados físicos.
    // El cliente debe existir en la tabla clients.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_equipo' => ['required', 'string', 'max:50', Rule::in([
                'PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo', 'Celular', 'Electrónica general',
            ])],
            'marca' => ['required', 'string', 'max:100'],
            'modelo' => ['required', 'string', 'max:100'],
            'numero_serie' => ['required', 'string', 'max:100', Rule::unique('devices', 'numero_serie')],
            'estado_fisico' => ['nullable', 'string', 'max:50', Rule::in(['Bueno', 'Regular', 'Malo'])],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_equipo.required' => 'El tipo de equipo es obligatorio.',
            'tipo_equipo.in' => 'El tipo de equipo seleccionado no es válido.',
            'marca.required' => 'La marca es obligatoria.',
            'modelo.required' => 'El modelo es obligatorio.',
            'numero_serie.required' => 'El número de serie es obligatorio.',
            'numero_serie.unique' => 'Este número de serie ya está registrado en el sistema.',
            'estado_fisico.in' => 'El estado físico seleccionado no es válido.',
            'client_id.required' => 'Debe seleccionar un cliente.',
            'client_id.exists' => 'El cliente seleccionado no existe.',
        ];
    }
}
