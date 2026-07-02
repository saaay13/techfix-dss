<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'cantidad' => ['sometimes', 'required', 'integer', 'min:1'],
            'precio_unitario' => ['sometimes', 'required', 'numeric', 'min:0'],
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del componente es obligatorio.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'precio_unitario.numeric' => 'El precio unitario debe ser un número.',
            'precio_unitario.min' => 'El precio unitario no puede ser negativo.',
        ];
    }
}
