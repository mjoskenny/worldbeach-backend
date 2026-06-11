<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration',
        'category',
        'icon',
        'color',
        'features',
        'image',
        'available',
    ];

    protected $casts = [
        'features' => 'array',
        'available' => 'boolean',
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


