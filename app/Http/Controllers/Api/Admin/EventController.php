<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(
            Event::with(['category', 'variants'])
                ->latest()
                ->get()
        );
    }

    // In EventController
public function show($id)
{
    $event = Event::with(['category', 'variants'])->find($id);

    if (!$event) {
        return response()->json(['message' => 'Event not found'], 404);
    }

    return response()->json($event);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'time'        => 'required|string',
            'status'      => 'required|in:upcoming,past,cancelled',
            'category_id' => 'nullable|exists:categories,id',
            'location'    => 'nullable|string|max:255',
            'featured'    => 'boolean',
            'variants'    => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        // Image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('events', 'public');
        }

        $validated['featured'] = $request->boolean('featured');

        $event = Event::create($validated);

        // Variants
        if ($request->filled('variants')) {
            $variants = json_decode($request->variants, true);

            foreach ($variants as $variant) {
                $event->variants()->create([
                    'name'         => $variant['name'],
                    'price'        => $variant['price'],
                    'capacity'     => $variant['capacity'],
                    'tickets_sold' => $variant['tickets_sold'] ?? 0,
                    'benefits'     => $variant['benefits'] ?? [],
                ]);
            }
        }

        return response()->json(
            $event->load(['category', 'variants']),
            201
        );
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'time'        => 'required|string',
            'status'      => 'required|in:upcoming,past,cancelled',
            'category_id' => 'nullable|exists:categories,id',
            'location'    => 'nullable|string|max:255',
            'featured'    => 'boolean',
            'variants'    => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        // Image update
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('events', 'public');
        }

        $validated['featured'] = $request->boolean('featured');

        $event->update($validated);

        // Reset variants
        $event->variants()->delete();

        if ($request->filled('variants')) {
            $variants = json_decode($request->variants, true);

            foreach ($variants as $variant) {
                $event->variants()->create([
                    'name'         => $variant['name'],
                    'price'        => $variant['price'],
                    'capacity'     => $variant['capacity'],
                    'tickets_sold' => $variant['tickets_sold'] ?? 0,
                    'benefits'     => $variant['benefits'] ?? [],
                ]);
            }
        }

        return response()->json(
            $event->load(['category', 'variants'])
        );
    }

    public function destroy($id)
    {
        Event::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Event deleted'
        ]);
    }
}
