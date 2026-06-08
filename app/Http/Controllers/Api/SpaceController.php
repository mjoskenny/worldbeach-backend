<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

        // Store image
        $filename = Str::random(20) . '.' . $request->file('image')->getClientOriginalExtension();
        $request->file('image')->storeAs('public/spaces', $filename);

        $space = Space::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'],
            'capacity' => $validated['capacity'] ?? null,
            'size' => $validated['size'] ?? null,
            'price_per_hour' => $validated['price_per_hour'],
            'features' => $validated['features'] ?? [],
            'image' => '/storage/spaces/' . $filename, // SINGLE STRING
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
            // Delete old image
            if ($space->image) {
                $oldPath = str_replace('/storage/', 'public/', $space->image);
                Storage::delete($oldPath);
            }

            $filename = Str::random(20) . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->storeAs('public/spaces', $filename);
            $space->image = '/storage/spaces/' . $filename;
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
            $path = str_replace('/storage/', 'public/', $space->image);
            Storage::delete($path);
        }

        $space->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
