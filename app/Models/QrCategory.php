<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}