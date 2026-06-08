<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}


