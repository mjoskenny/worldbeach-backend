<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Support\UploadStorage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Exception;

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
            try {
                $validated = array_merge($validated, $this->uploadMenuItemImage($request->file('image')));
            } catch (Exception $e) {
                Log::error('API: MenuItem image upload failed for store', ['message' => $e->getMessage()]);
                return response()->json(['message' => 'Image upload failed'], 500);
            }
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
            try {
                if ($item->image_public_id) {
                    try {
                        cloudinary()->admin()->deleteAssets($item->image_public_id);
                        Log::info('API: Deleted old MenuItem image from Cloudinary', ['public_id' => $item->image_public_id]);
                    } catch (Exception $ex) {
                        Log::warning('API: Failed to delete old Cloudinary asset during MenuItem update', ['public_id' => $item->image_public_id, 'error' => $ex->getMessage()]);
                    }
                } elseif ($item->image) {
                    UploadStorage::delete($item->getRawOriginal('image'));
                }

                $validated = array_merge($validated, $this->uploadMenuItemImage($request->file('image')));
            } catch (Exception $e) {
                Log::error('API: MenuItem image upload failed for update', ['message' => $e->getMessage()]);
                return response()->json(['message' => 'Image upload failed'], 500);
            }
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

        if ($item->image_public_id) {
            try {
                cloudinary()->admin()->deleteAssets($item->image_public_id);
                Log::info('API: Deleted MenuItem Cloudinary asset on destroy', ['public_id' => $item->image_public_id]);
            } catch (Exception $e) {
                Log::warning('API: Failed to delete MenuItem Cloudinary asset on destroy', ['public_id' => $item->image_public_id, 'error' => $e->getMessage()]);
            }
        } elseif ($item->image) {
            \App\Support\UploadStorage::delete($item->getRawOriginal('image'));
        }

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function uploadMenuItemImage(UploadedFile $file): array
    {
        if (! config('cloudinary.cloud_url')) {
            $storedUrl = UploadStorage::store($file, 'menu_items');
            Log::warning('Cloudinary is not configured; storing menu item image locally.', ['path' => $storedUrl]);

            return [
                'image_url' => $storedUrl,
                'image_public_id' => null,
                'image' => null,
            ];
        }

        $uploadResult = cloudinary()->upload($file->getRealPath(), [
            'folder' => 'menu_items',
        ]);

        return [
            'image_url' => $uploadResult->getSecurePath(),
            'image_public_id' => $uploadResult->getPublicId(),
            'image' => null,
        ];
    }
}
