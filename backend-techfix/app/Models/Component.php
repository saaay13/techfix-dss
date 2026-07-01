<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Component extends Model
{
    use HasFactory;
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

    public function scopeCriticalStock(Builder $query): Builder
    {
        return $query->where('activo', true)
            ->whereColumn('cantidad', '<=', 'stock_minimo');
    }
}
