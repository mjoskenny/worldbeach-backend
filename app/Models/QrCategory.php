<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QrCategory extends Model
{
    protected $fillable = ['name', 'image', 'position'];

    public function items()
    {
        return $this->hasMany(QrMenuItem::class);
    }

    public function menuItems()
{
    return $this->hasMany(QrMenuItem::class, 'qr_category_id')
                ->orderBy('position');
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
