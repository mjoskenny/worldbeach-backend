<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Support\UploadStorage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Exception;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menuItems = MenuItem::with('category')->latest()->paginate(10);
        return view('admin.menu-items.index', compact('menuItems'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return view('admin.menu-items.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'variant_price' => 'nullable|numeric',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['name', 'description', 'price', 'variant_price', 'category_id']);

        // Handle image upload
        if ($request->hasFile('image')) {
            try {
                $data = array_merge($data, $this->uploadMenuItemImage($request->file('image')));
            } catch (Exception $e) {
                Log::error('MenuItem image upload failed for store', ['message' => $e->getMessage()]);
                return redirect()->back()->withInput()->withErrors(['image' => 'Image upload failed. Please try again later.']);
            }
        }

        MenuItem::create($data);

        return redirect()->route('admin.menu-items.index')->with('success', 'Menu item created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MenuItem $menuItem)
    {
        $categories = Category::all();
        return view('admin.menu-items.edit', compact('menuItem', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'variant_price' => 'nullable|numeric',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['name', 'description', 'price', 'variant_price', 'category_id']);

        if ($request->hasFile('image')) {
            try {
                if ($menuItem->image_public_id) {
                    try {
                        cloudinary()->admin()->deleteAssets($menuItem->image_public_id);
                        Log::info('Deleted old MenuItem image from Cloudinary', ['public_id' => $menuItem->image_public_id]);
                    } catch (Exception $ex) {
                        Log::warning('Failed to delete old Cloudinary asset during MenuItem update', ['public_id' => $menuItem->image_public_id, 'error' => $ex->getMessage()]);
                    }
                } elseif ($menuItem->image) {
                    UploadStorage::delete($menuItem->getRawOriginal('image'));
                }

                $data = array_merge($data, $this->uploadMenuItemImage($request->file('image')));
            } catch (Exception $e) {
                Log::error('MenuItem image upload failed for update', ['message' => $e->getMessage()]);
                return redirect()->back()->withInput()->withErrors(['image' => 'Image upload failed. Please try again later.']);
            }
        }

        $menuItem->update($data);

        return redirect()->route('admin.menu-items.index')->with('success', 'Menu item updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuItem $menuItem)
    {
        if ($menuItem->image_public_id) {
            try {
                cloudinary()->admin()->deleteAssets($menuItem->image_public_id);
                Log::info('Deleted MenuItem Cloudinary asset on destroy', ['public_id' => $menuItem->image_public_id]);
            } catch (Exception $e) {
                Log::warning('Failed to delete MenuItem Cloudinary asset on destroy', ['public_id' => $menuItem->image_public_id, 'error' => $e->getMessage()]);
            }
        }

        if (! $menuItem->image_public_id && $menuItem->image) {
            \App\Support\UploadStorage::delete($menuItem->getRawOriginal('image'));
        }
        $menuItem->delete();
        return redirect()->route('admin.menu-items.index')->with('success', 'Menu item deleted successfully!');
    }

    private function uploadMenuItemImage(UploadedFile $file): array
    {
        if (! config('cloudinary.cloud_url')) {
            $storedUrl = UploadStorage::store($file, 'menu_images');
            Log::warning('Cloudinary is not configured; storing menu item image locally.', ['path' => $storedUrl]);

            return [
                'image_url' => $storedUrl,
                'image_public_id' => null,
                'image' => null,
            ];
        }

        $uploadResult = cloudinary()->upload($file->getRealPath(), [
            'folder' => 'menu_images',
        ]);

        return [
            'image_url' => $uploadResult->getSecurePath(),
            'image_public_id' => $uploadResult->getPublicId(),
            'image' => null,
        ];
    }
}
