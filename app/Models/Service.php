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


