<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    public function getLogoUrlAttribute()
    {
        if (! $this->logo_path) {
            return null;
        }

        if (Str::startsWith($this->logo_path, ['http://', 'https://'])) {
            return $this->logo_path;
        }

        $path = ltrim($this->logo_path, '/');

        if (Str::startsWith($path, 'storage/')) {
            $path = ltrim(Str::after($path, 'storage/'), '/');
        }

        if (Str::startsWith($path, 'public/')) {
            $path = ltrim(Str::after($path, 'public/'), '/');
        }

        return asset('storage/' . $path);
    }
}
