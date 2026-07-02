<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Device extends Model
{
    use HasFactory;

    // HU-02: Equipo registrado por el recepcionista. Cada equipo pertenece
    // a un cliente y tiene un número de serie único como identificador físico.
    // El borrado es lógico (activo = false) para preservar el historial.
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
}
