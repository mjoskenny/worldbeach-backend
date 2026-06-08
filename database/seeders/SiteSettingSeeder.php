<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::updateOrCreate(
            ['id' => 1],
            [
                'business_name' => 'World Beach Burundi',
                'tagline' => 'Where the Lake Meets Luxury',
                'phone' => '+257 22 28 45 67',
                'secondary_phone' => '+257 79 12 34 56',
                'email' => 'hello@worldbeach.bi',
                'secondary_email' => 'info@worldbeachburundi.com',
                'address' => 'Avenue de la Plage, Bujumbura, Burundi',
                'weekday_hours' => '09:00 - 23:00',
                'weekend_hours' => '08:00 - 00:00',
                'facebook_url' => 'https://facebook.com/worldbeachburundi',
                'instagram_url' => 'https://instagram.com/worldbeachburundi',
                'twitter_url' => 'https://twitter.com/worldbeachbi',
                'map_url' => 'https://maps.google.com',
            ]
        );
    }
}
