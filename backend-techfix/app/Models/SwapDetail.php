<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SwapDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'component_swap_id',
        'component_id',
        'tipo',
        'cantidad',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
        ];
    }

    public function componentSwap(): BelongsTo
    {
        return $this->belongsTo(ComponentSwap::class);
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }
}
