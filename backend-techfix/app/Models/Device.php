<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_equipo',
        'marca',
        'modelo',
        'numero_serie',
        'estado_fisico',
        'activo',
        'client_id',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function serviceOrders(): HasMany
    {
        return $this->hasMany(ServiceOrder::class);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('tipo_equipo', 'like', "%{$search}%")
              ->orWhere('marca', 'like', "%{$search}%")
              ->orWhere('modelo', 'like', "%{$search}%")
              ->orWhere('numero_serie', 'like', "%{$search}%");
        });
    }
}
