<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
    'name',
    'type',
    'icon',
    'description',
];


    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }

    public function events()
{
    return $this->hasMany(Event::class);
}

}
