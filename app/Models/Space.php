<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}

