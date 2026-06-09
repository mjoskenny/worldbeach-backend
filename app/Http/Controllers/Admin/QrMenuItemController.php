<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrMenuItem;
use App\Models\QrCategory;
use App\Support\UploadStorage;
use Illuminate\Http\Request;

class QrMenuItemController extends Controller
{
    public function index()
    {
        $items = QrMenuItem::with('category')->latest()->get();
        return view('admin.qr_menu_items.index', compact('items'));
    }

    public function create()
    {
        $categories = QrCategory::all();
        return view('admin.qr_menu_items.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'qr_category_id' => 'required|exists:qr_categories,id',
            'name' => 'required',
            'description' => 'nullable',
            'price' => 'nullable|integer',
            'image' => 'required|image',
            'position' => 'nullable|integer'
        ]);

        $data['image'] = UploadStorage::store($request->file('image'), 'qr_menu_images');

        QrMenuItem::create($data);

        return redirect()->route('admin.qr-menu-items.index')
            ->with('success', 'Item created');
    }

    public function edit(QrMenuItem $qr_menu_item)
    {
        $categories = QrCategory::all();
        return view('admin.qr_menu_items.edit', compact('qr_menu_item', 'categories'));
    }

    public function update(Request $request, QrMenuItem $qr_menu_item)
    {
        $data = $request->validate([
            'qr_category_id' => 'required|exists:qr_categories,id',
            'name' => 'required',
            'description' => 'nullable',
            'price' => 'nullable|integer',
            'image' => 'nullable|image',
            'position' => 'nullable|integer'
        ]);

        if ($request->hasFile('image')) {
            UploadStorage::delete($qr_menu_item->getRawOriginal('image'));
            $data['image'] = UploadStorage::store($request->file('image'), 'qr_menu_images');
        }

        $qr_menu_item->update($data);

        return redirect()->route('admin.qr-menu-items.index')
            ->with('success', 'Updated');
    }

    public function destroy(QrMenuItem $qr_menu_item)
    {
        UploadStorage::delete($qr_menu_item->getRawOriginal('image'));
        $qr_menu_item->delete();
        return back()->with('success', 'Deleted');
    }
}
