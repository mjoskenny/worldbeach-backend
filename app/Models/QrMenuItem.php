<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}