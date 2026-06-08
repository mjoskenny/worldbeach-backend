<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'date',
        'time',
        'description',
        'status',
        'image',
        'category_id',
        'location',
        'featured',
    ];


    public function variants()
    {
        return $this->hasMany(EventVariant::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function ticketOrders()
    {
        return $this->hasMany(EventTicketOrder::class);
    }
}
