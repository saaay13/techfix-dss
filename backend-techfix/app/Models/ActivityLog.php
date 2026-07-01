<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'service_order_item_id',
        'activity_id',
        'user_id',
        'descripcion_personalizada',
    ];

    public function serviceOrderItem(): BelongsTo
    {
        return $this->belongsTo(ServiceOrderItem::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
