<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Support\UploadStorage;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    /**
     * Store a new menu item
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric',
            'variant_price' => 'nullable|numeric',
            'image'         => 'nullable|image|max:2048',
            'featured'      => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = UploadStorage::store($request->file('image'), 'menu-items');
        }

        $menuItem = MenuItem::create(array_merge(['featured' => false], $validated));

        return response()->json($menuItem, 201);
    }

    /**
     * Update an existing menu item
     */
    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric',
            'variant_price' => 'nullable|numeric',
            'image'         => 'nullable|image|max:2048',
            'featured'      => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($item->image) {
                UploadStorage::delete($item->getRawOriginal('image'));
            }

            $validated['image'] = UploadStorage::store($request->file('image'), 'menu-items');
        }

        $item->update($validated);

        return response()->json($item);
    }

    /**
     * Delete a menu item
     */
    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);

        if ($item->image) {
            UploadStorage::delete($item->getRawOriginal('image'));
        }

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
