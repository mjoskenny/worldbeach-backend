<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrMenuItem;
use App\Models\QrCategory;
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

        $data['image'] = $request->file('image')->store('qr_menu_images', 'public');

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
            $data['image'] = $request->file('image')->store('qr_menu_images', 'public');
        }

        $qr_menu_item->update($data);

        return redirect()->route('admin.qr-menu-items.index')
            ->with('success', 'Updated');
    }

    public function destroy(QrMenuItem $qr_menu_item)
    {
        $qr_menu_item->delete();
        return back()->with('success', 'Deleted');
    }
}