<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // List all services
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    // Show a single service
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service, 200);
    }

    // Create a new service
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:services',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'duration' => 'nullable|string',
            'category' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'features' => 'nullable|array',
            'image' => 'nullable|string',
            'available' => 'boolean',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service
        ], 201);
    }

    // Update an existing service
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:services,slug,' . $id,
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'duration' => 'nullable|string',
            'category' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'features' => 'nullable|array',
            'image' => 'nullable|string',
            'available' => 'boolean',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service
        ], 200);
    }

    // Delete a service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully'
        ], 200);
    }
}