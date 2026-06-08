<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventVariant extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'price',
        'capacity',
        'tickets_sold',
        'benefits',
    ];

    protected $casts = [
        'benefits' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function ticketOrders()
    {
        return $this->hasMany(EventTicketOrder::class, 'event_variant_id');
    }

}
