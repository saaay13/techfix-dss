<?php

namespace App\Models;

use Database\Factories\ActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Activity extends Model
{
    /** @use HasFactory<ActivityFactory> */
    use HasFactory;

    protected $fillable = ['nombre', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function serviceTypes(): BelongsToMany
    {
        return $this->belongsToMany(ServiceType::class, 'activity_service_type');
    }
}
