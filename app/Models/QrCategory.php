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

        return Str::startsWith($this->image, ['http://', 'https://'])
            ? $this->image
            : asset('storage/' . ltrim($this->image, '/'));
    }
}
