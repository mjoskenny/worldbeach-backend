<?php
namespace App\Http\Controllers;

use App\Models\Service;
use App\Support\UploadStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        return Service::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'duration' => 'nullable|string',
            'category' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'available' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        // slug
        $data['slug'] = Str::slug($data['name']);

        // image
        if ($request->hasFile('image')) {
            $publicId = 'services/' . Str::random(20);
            $upload = cloudinary()->upload(
                $request->file('image')->getRealPath(),
                [
                    'public_id' => $publicId,
                    'resource_type' => 'image',
                    'overwrite' => true,
                ]
            );

            $data['image'] = $upload->getSecurePath();
        }

        return Service::create($data);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'duration' => 'nullable|string',
            'category' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'available' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            if ($service->image && ! Str::startsWith($service->image, ['http://', 'https://'])) {
                UploadStorage::delete($service->getRawOriginal('image'));
            }

            $publicId = 'services/' . Str::random(20);
            $upload = cloudinary()->upload(
                $request->file('image')->getRealPath(),
                [
                    'public_id' => $publicId,
                    'resource_type' => 'image',
                    'overwrite' => true,
                ]
            );

            $data['image'] = $upload->getSecurePath();
        }

        $service->update($data);

        return $service;
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        if ($service->image && ! Str::startsWith($service->image, ['http://', 'https://'])) {
            UploadStorage::delete($service->getRawOriginal('image'));
        }

        $service->delete();
        return response()->json(['success' => true]);
    }
}
