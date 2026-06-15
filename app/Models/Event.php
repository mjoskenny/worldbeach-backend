<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    public function getDisplayImageUrlAttribute()
    {
        if (! $this->image) {
            return null;
        }

        if (Str::startsWith($this->image, ['http://', 'https://'])) {
            return $this->image;
        }

        $path = ltrim($this->image, '/');

        if (Str::startsWith($path, 'storage/')) {
            $path = ltrim(Str::after($path, 'storage/'), '/');
        }

        if (Str::startsWith($path, 'public/')) {
            $path = ltrim(Str::after($path, 'public/'), '/');
        }

        return asset('storage/' . $path);
    }
}
