<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceTypeRequest extends FormRequest
{
    // HU-16: Misma validación que StoreServiceTypeRequest pero ignorando
    // el ID actual para permitir mantener el mismo nombre en la actualización.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255', Rule::unique('service_types', 'nombre')->ignore($this->route('service_type'))],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'precio' => ['required', 'numeric', 'min:0'],
            'activo' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del tipo de servicio es obligatorio.',
            'nombre.unique' => 'Ya existe un tipo de servicio con ese nombre.',
            'precio.min' => 'El precio no puede ser negativo.',
        ];
    }
}
