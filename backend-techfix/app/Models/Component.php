<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Component extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'cantidad',
        'stock_minimo',
        'precio_unitario',
        'category_id',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'stock_minimo' => 'integer',
            'precio_unitario' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
