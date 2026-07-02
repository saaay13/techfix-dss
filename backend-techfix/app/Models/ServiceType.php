<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceType extends Model
{
    use HasFactory;

    // HU-16: Catálogo de tipos de servicio. Cada tipo tiene un nombre único,
    // descripción opcional y precio base. El borrado es lógico (activo = false)
    // para mantener integridad en órdenes de servicio que lo referencien.
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }
}
