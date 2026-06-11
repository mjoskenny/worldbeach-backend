<?php

namespace App\Http\Controllers; 


use App\Models\Gallery;
use App\Support\UploadStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

    $publicId = 'gallery/' . Str::random(20);
    $upload = cloudinary()->upload(
        $request->file('image')->getRealPath(),
        [
            'public_id' => $publicId,
            'resource_type' => 'image',
            'overwrite' => true,
        ]
    );

    $position = Gallery::where('category', $request->category)->max('position') + 1;

    return Gallery::create([
        'category' => $request->category,
        'image' => $upload->getSecurePath(),
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
        if ($gallery->image && ! Str::startsWith($gallery->image, ['http://', 'https://'])) {
            UploadStorage::delete($gallery->getRawOriginal('image'));
        }

        $publicId = 'gallery/' . Str::random(20);
        $upload = cloudinary()->upload(
            $request->file('image')->getRealPath(),
            [
                'public_id' => $publicId,
                'resource_type' => 'image',
                'overwrite' => true,
            ]
        );

        $gallery->image = $upload->getSecurePath();
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

        if ($gallery->image && ! Str::startsWith($gallery->image, ['http://', 'https://'])) {
            UploadStorage::delete($gallery->getRawOriginal('image'));
        }

        $gallery->delete();
        return response()->json(['success' => true]);
    }
}
