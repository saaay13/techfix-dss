<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComponentSwap extends Model
{
    use HasFactory;

    // HU-07: Registra el reemplazo de un componente en una orden de servicio.
    // Agrupa dos movimientos (retirado + instalado) mediante SwapDetail.
    protected $fillable = [
        'service_order_id',
        'observaciones',
        'devuelto_al_cliente', // Indica si el componente retirado se devolvió al cliente
    ];

    protected function casts(): array
    {
        return [
            'devuelto_al_cliente' => 'boolean',
        ];
    }

    // Una orden de servicio puede tener múltiples cambios de componente
    public function serviceOrder(): BelongsTo
    {
        return $this->belongsTo(ServiceOrder::class);
    }

    // Cada cambio genera dos registros: uno para el retirado y otro para el instalado
    public function swapDetails(): HasMany
    {
        return $this->hasMany(SwapDetail::class);
    }
}
