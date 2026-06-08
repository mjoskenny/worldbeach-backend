<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'business_name',
        'tagline',
        'logo_path',
        'about_title',
        'about_description',
        'about_mission',
        'about_vision',
        'about_history',
        'phone',
        'secondary_phone',
        'email',
        'secondary_email',
        'address',
        'weekday_hours',
        'weekend_hours',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'map_url',
    ];
}
