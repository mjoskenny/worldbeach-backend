<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QrMenuItem extends Model
{
    protected $fillable = [
        'qr_category_id',
        'name',
        'description',
        'price',
        'image',
        'is_featured',
        'position'
    ];

    public function category()
    {
        return $this->belongsTo(QrCategory::class, 'qr_category_id');
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
