<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTicketOrder extends Model
{
    protected $fillable = [
        'order_id',
        'event_id',
        'event_variant_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'quantity',
        'unit_price',
        'total_amount',
        'payment_method',
        'ussd_code',
        'status',
        'ordered_at',
    ];

    protected $casts = [
        'ordered_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function variant()
    {
        return $this->belongsTo(EventVariant::class, 'event_variant_id');
    }
}
