<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MenuItem extends Model
{
    protected $table = 'menu_items';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'variant_price',
        'image',
        'image_url',
        'image_public_id',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function getDisplayImageUrlAttribute()
    {
        if ($this->image_url) {
            return $this->image_url;
        }

        if (! $this->image) {
            return null;
        }

        return Str::startsWith($this->image, ['http://', 'https://'])
            ? $this->image
            : asset('storage/' . ltrim($this->image, '/'));
    }

    public function getImageAttribute($value)
    {
        if (! empty($this->attributes['image_url'])) {
            return $this->attributes['image_url'];
        }

        if (! $value) {
            return null;
        }

        return Str::startsWith($value, ['http://', 'https://'])
            ? $value
            : asset('storage/' . ltrim($value, '/'));
    }
}
