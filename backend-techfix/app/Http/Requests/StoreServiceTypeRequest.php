<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceTypeRequest extends FormRequest
{
    // HU-16: Valida que el nombre sea único (para evitar duplicados en el catálogo),
    // el precio no sea negativo y la descripción sea opcional.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255', 'unique:service_types,nombre'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'precio' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del tipo de servicio es obligatorio.',
            'nombre.unique' => 'Ya existe un tipo de servicio con ese nombre.',
            'precio.required' => 'El precio es obligatorio.',
            'precio.min' => 'El precio no puede ser negativo.',
        ];
    }
}
