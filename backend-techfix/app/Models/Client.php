<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'correo',
        'ci',
        'activo',
    ];
    
    protected $hidden = [
        'activo',
    ];
    
    protected $casts = [
        'activo' => 'boolean',
    ];
    
    public function scopeActive($query)
    {
        return $query->where('activo', true);
    }
    
    public function scopeInactive($query)
    {
        return $query->where('activo', false);
    }
    
    public function scopeSearch($query, $search)
    {
        return $query->where('nombre', 'like', "%{$search}%")
            ->orWhere('apellido', 'like', "%{$search}%")
            ->orWhere('telefono', 'like', "%{$search}%")
            ->orWhere('correo', 'like', "%{$search}%");
    }
    
}
