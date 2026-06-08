<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrCategory;
use Illuminate\Http\Request;

class QrCategoryController extends Controller
{
    public function index()
    {
        $categories = QrCategory::orderBy('position')->get();
        return view('admin.qr_categories.index', compact('categories'));
    }

    public function create()
    {
        return view('admin.qr_categories.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'image' => 'nullable|image',
            'position' => 'nullable|integer'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('qr_menu_images', 'public');
        }

        QrCategory::create($data);

        return redirect()->route('admin.qr-categories.index')
            ->with('success', 'Category created successfully');
    }

    public function edit(QrCategory $qr_category)
    {
        return view('admin.qr_categories.edit', compact('qr_category'));
    }

    public function update(Request $request, QrCategory $qr_category)
    {
        $data = $request->validate([
            'name' => 'required',
            'image' => 'nullable|image',
            'position' => 'nullable|integer'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('qr_menu_images', 'public');
        }

        $qr_category->update($data);

        return redirect()->route('admin.qr-categories.index')
            ->with('success', 'Category updated');
    }

    public function destroy(QrCategory $qr_category)
    {
        $qr_category->delete();
        return back()->with('success', 'Deleted');
    }
}