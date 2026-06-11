<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\UploadStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SiteSettingController extends Controller
{
    private function defaults(): array
    {
        return [
            'business_name' => 'World Beach Burundi',
            'tagline' => 'Where the Lake Meets Luxury',
            'logo_path' => null,
            'about_title' => 'About World Beach Burundi',
            'about_description' => 'A culinary journey inspired by Lake Tanganyika and the vibrant culture of Burundi.',
            'about_mission' => 'Our mission is to create memorable dining experiences that blend warm hospitality, fresh ingredients, and the beauty of the lakeside.',
            'about_vision' => 'Our vision is to be the destination where guests gather for great food, genuine connection, and unforgettable moments by the water.',
            'about_history' => 'World Beach Burundi was built to bring people together through food, atmosphere, and the natural charm of Bujumbura.',
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
        ];
    }

    private function setting(): SiteSetting
    {
        return SiteSetting::firstOrCreate([], $this->defaults());
    }

    public function show()
    {
        return response()->json($this->setting());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'logo_path' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:4096',
            'about_title' => 'nullable|string|max:255',
            'about_description' => 'nullable|string',
            'about_mission' => 'nullable|string',
            'about_vision' => 'nullable|string',
            'about_history' => 'nullable|string',
            'phone' => 'required|string|max:50',
            'secondary_phone' => 'nullable|string|max:50',
            'email' => 'required|email|max:255',
            'secondary_email' => 'nullable|email|max:255',
            'address' => 'required|string|max:1000',
            'weekday_hours' => 'required|string|max:100',
            'weekend_hours' => 'required|string|max:100',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'map_url' => 'nullable|url|max:255',
        ]);

        $setting = $this->setting();

        if ($request->hasFile('logo')) {
            if ($setting->logo_path && ! Str::startsWith($setting->logo_path, ['http://', 'https://'])) {
                UploadStorage::delete($setting->getRawOriginal('logo_path'));
            }

            $publicId = 'site_settings/' . Str::random(20);
            $upload = cloudinary()->upload(
                $request->file('logo')->getRealPath(),
                [
                    'public_id' => $publicId,
                    'resource_type' => 'image',
                    'overwrite' => true,
                ]
            );

            $validated['logo_path'] = $upload->getSecurePath();
        }

        $setting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
            'settings' => $setting->fresh(),
        ]);
    }
}
