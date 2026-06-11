<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Space extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'capacity',
        'price_per_hour',
        'features',
        'image',
    ];

    protected $casts = [
        'features' => 'array',
        'price_per_hour' => 'decimal:2',
    ];

    public function getDisplayImageUrlAttribute()
    {
        if (! $this->image) {
            return null;
        }

        return Str::startsWith($this->image, ['http://', 'https://'])
            ? $this->image
            : asset('storage/' . ltrim($this->image, '/'));
    }
}

