<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class ServiceOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha_ingreso',
        'diagnostico_inicial',
        'estado',
        'prioridad',
        'fecha_estimada_entrega',
        'observaciones',
        'costo_total',
        'client_id',
        'device_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_ingreso' => 'date',
            'fecha_estimada_entrega' => 'date',
            'costo_total' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceOrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(StatusHistory::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('diagnostico_inicial', 'like', "%{$search}%")
              ->orWhere('observaciones', 'like', "%{$search}%")
              ->orWhere('estado', 'like', "%{$search}%")
              ->orWhere('prioridad', 'like', "%{$search}%");
        });
    }

    public function scopeByEstado(Builder $query, $estado): Builder
    {
        return $query->where('estado', $estado);
    }

    public function scopeByPrioridad(Builder $query, $prioridad): Builder
    {
        return $query->where('prioridad', $prioridad);
    }
}
