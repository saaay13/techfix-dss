<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComponentSwap extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_order_id',
        'observaciones',
        'devuelto_al_cliente',
    ];

    protected function casts(): array
    {
        return [
            'devuelto_al_cliente' => 'boolean',
        ];
    }

    public function serviceOrder(): BelongsTo
    {
        return $this->belongsTo(ServiceOrder::class);
    }

    public function swapDetails(): HasMany
    {
        return $this->hasMany(SwapDetail::class);
    }
}
