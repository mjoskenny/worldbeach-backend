<?php

namespace App\Http\Controllers; 


use App\Models\Gallery;
use App\Support\UploadStorage;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
{
    return response()->json(
        Gallery::query()
            ->orderBy('category')
            ->orderBy('position')
            ->orderByDesc('created_at')
            ->get()
    );
}



    public function store(Request $request)
{
    $request->validate([
        'category' => 'required',
        'image' => 'required|image',
    ]);

    $path = UploadStorage::store($request->file('image'), 'gallery');

    $position = Gallery::where('category', $request->category)->max('position') + 1;

    return Gallery::create([
        'category' => $request->category,
        'image' => $path,
        'title' => $request->title,
        'description' => $request->description,
        'date' => $request->date,
        'position' => $position,
    ]);
}


    public function update(Request $request, $id)
{
    $gallery = Gallery::findOrFail($id);

    $request->validate([
        'category' => 'required',
        'image' => 'nullable|image',
    ]);

    if ($request->hasFile('image')) {
        UploadStorage::delete($gallery->getRawOriginal('image'));
        $gallery->image = UploadStorage::store($request->file('image'), 'gallery');
    }

    $gallery->category = $request->category;
    $gallery->title = $request->title;
    $gallery->description = $request->description;
    $gallery->date = $request->date;
    $gallery->save();

    return response()->json($gallery);
}



    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        UploadStorage::delete($gallery->getRawOriginal('image'));
        $gallery->delete();
        return response()->json(['success' => true]);
    }
}
