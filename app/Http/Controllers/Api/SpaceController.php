<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Support\UploadStorage;

class SpaceController extends Controller
{
    public function index()
    {
        return Space::all();
    }

    public function show($id)
    {
        $space = Space::find($id);
        if (!$space) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return $space;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:indoor,outdoor,private',
            'capacity' => 'nullable|integer',
            'size' => 'nullable|string',
            'price_per_hour' => 'required|numeric',

            // FEATURES AS ARRAY
            'features' => 'nullable|array',
            'features.*' => 'string',

            // SINGLE IMAGE
            'image' => 'required|image|max:4096',
        ]);

        $publicId = 'spaces/' . Str::random(20);
        $upload = cloudinary()->upload(
            $request->file('image')->getRealPath(),
            [
                'public_id' => $publicId,
                'resource_type' => 'image',
                'overwrite' => true,
            ]
        );

        $space = Space::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'],
            'capacity' => $validated['capacity'] ?? null,
            'size' => $validated['size'] ?? null,
            'price_per_hour' => $validated['price_per_hour'],
            'features' => $validated['features'] ?? [],
            'image' => $upload->getSecurePath(),
        ]);

        return response()->json($space, 201);
    }

    public function update(Request $request, $id)
    {
        $space = Space::find($id);
        if (!$space) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:indoor,outdoor,private',
            'capacity' => 'nullable|integer',
            'size' => 'nullable|string',
            'price_per_hour' => 'required|numeric',

            // FEATURES AS ARRAY
            'features' => 'nullable|array',
            'features.*' => 'string',

            // IMAGE OPTIONAL ON UPDATE
            'image' => 'nullable|image|max:4096',
        ]);

        // Handle image replacement
        if ($request->hasFile('image')) {
            // Delete old image path only when the previous value was stored locally.
            if ($space->image && ! Str::startsWith($space->image, ['http://', 'https://'])) {
                UploadStorage::delete($space->getRawOriginal('image'));
            }

            $publicId = 'spaces/' . Str::random(20);
            $upload = cloudinary()->upload(
                $request->file('image')->getRealPath(),
                [
                    'public_id' => $publicId,
                    'resource_type' => 'image',
                    'overwrite' => true,
                ]
            );

            $space->image = $upload->getSecurePath();
        }

        $space->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'],
            'capacity' => $validated['capacity'] ?? null,
            'size' => $validated['size'] ?? null,
            'price_per_hour' => $validated['price_per_hour'],
            'features' => $validated['features'] ?? [],
        ]);

        return response()->json($space);
    }

    public function destroy($id)
    {
        $space = Space::find($id);
        if (!$space) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        if ($space->image) {
            UploadStorage::delete($space->getRawOriginal('image'));
        }

        $space->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
