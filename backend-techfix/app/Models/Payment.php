<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    // HU-08: Modelo de pagos. Cada pago se asocia a una orden de servicio.
    // La validación de monto vs saldo restante se hace en el controlador
    // para dar mensajes precisos al usuario (422 con detalle).
    protected $fillable = [
        'monto',
        'metodo_pago',
        'fecha',
        'service_order_id',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha' => 'date',
        ];
    }

    public function serviceOrder(): BelongsTo
    {
        return $this->belongsTo(ServiceOrder::class);
    }
}
