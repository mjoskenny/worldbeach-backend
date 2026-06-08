<?php
namespace App\Http\Controllers;

use App\Models\Service;
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
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = '/storage/' . $path;
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
            $path = $request->file('image')->store('services', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $service->update($data);

        return $service;
    }

    public function destroy($id)
    {
        Service::destroy($id);
        return response()->json(['success' => true]);
    }
}
