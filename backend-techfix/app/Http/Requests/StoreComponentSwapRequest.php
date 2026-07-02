<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComponentSwapRequest extends FormRequest
{
    // HU-07: Valida que ambos componentes (retirado e instalado) existan en el inventario,
    // que las cantidades sean positivas y que la orden de servicio sea válida.
    // No valida stock disponible del retirado porque podría ser una retirada por daño
    // o devolución; el control de stock se maneja por separado.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_order_id' => ['required', 'integer', 'min:1', 'exists:service_orders,id'],
            'observaciones' => ['nullable', 'string', 'max:2000'],
            'devuelto_al_cliente' => ['boolean'],
            'retirado_component_id' => ['required', 'integer', 'min:1', 'exists:components,id'],
            'retirado_cantidad' => ['required', 'integer', 'min:1'],
            'instalado_component_id' => ['required', 'integer', 'min:1', 'exists:components,id'],
            'instalado_cantidad' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'service_order_id.required' => 'Debe seleccionar una orden de servicio.',
            'service_order_id.exists' => 'La orden no existe.',
            'retirado_component_id.required' => 'Debe seleccionar el componente retirado.',
            'retirado_component_id.exists' => 'El componente retirado no existe.',
            'instalado_component_id.required' => 'Debe seleccionar el componente instalado.',
            'instalado_component_id.exists' => 'El componente instalado no existe.',
            'retirado_cantidad.min' => 'La cantidad retirada debe ser al menos 1.',
            'instalado_cantidad.min' => 'La cantidad instalada debe ser al menos 1.',
        ];
    }
}
