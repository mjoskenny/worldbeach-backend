<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; // ✅ correct
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\MenuItem;
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
                $uploadResult = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'menu_images',
                ]);

                $data['image_url'] = $uploadResult->getSecurePath();
                $data['image_public_id'] = $uploadResult->getPublicId();
                $data['image'] = null;

                Log::info('MenuItem image uploaded to Cloudinary', ['public_id' => $data['image_public_id'], 'url' => $data['image_url']]);
            } catch (Exception $e) {
                Log::error('Cloudinary upload failed for MenuItem store', ['message' => $e->getMessage()]);
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
                }

                $uploadResult = cloudinary()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'menu_images',
                ]);

                $data['image_url'] = $uploadResult->getSecurePath();
                $data['image_public_id'] = $uploadResult->getPublicId();
                $data['image'] = null;

                Log::info('MenuItem image uploaded to Cloudinary (update)', ['public_id' => $data['image_public_id'], 'url' => $data['image_url']]);
            } catch (Exception $e) {
                Log::error('Cloudinary upload failed for MenuItem update', ['message' => $e->getMessage()]);
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
}
