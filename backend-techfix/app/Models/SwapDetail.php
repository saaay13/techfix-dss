<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SwapDetail extends Model
{
    use HasFactory;

    // HU-07: Detalle individual de un cambio. Cada instancia representa un movimiento
    // de inventario: "retirado" (sale del stock) o "instalado" (se coloca en el equipo).
    // Esta estructura permite documentar ambos lados del cambio en un solo formulario.
    protected $fillable = [
        'component_swap_id',
        'component_id',
        'tipo', // 'retirado' | 'instalado'
        'cantidad',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
        ];
    }

    // Pertenece al cambio de componente padre que agrupa retirado + instalado
    public function componentSwap(): BelongsTo
    {
        return $this->belongsTo(ComponentSwap::class);
    }

    // Referencia al catálogo de componentes del inventario
    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }
}
