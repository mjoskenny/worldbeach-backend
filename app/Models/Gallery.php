<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'image',
        'title',
        'description',
        'date',
        'position',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
