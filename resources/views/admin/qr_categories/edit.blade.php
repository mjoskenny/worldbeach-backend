@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Edit QR Category</h1>

    <form 
        action="{{ route('admin.qr-categories.update', $qr_category->id) }}" 
        method="POST" 
        enctype="multipart/form-data"
        class="bg-white p-6 rounded shadow space-y-4"
    >
        @csrf
        @method('PUT')

        <div>
            <label class="block mb-1 font-medium">Category Name</label>
            <input 
                type="text" 
                name="name" 
                value="{{ old('name', $qr_category->name) }}"
                class="w-full border rounded px-3 py-2"
                required
            >
        </div>

        <div>
            <label class="block mb-1 font-medium">Current Image</label>

            @if($qr_category->image)
                <div class="mb-3">
                    <img 
                        src="{{ asset('storage/' . $qr_category->image) }}" 
                        alt="{{ $qr_category->name }}"
                        class="w-32 h-32 object-cover rounded border"
                    >
                </div>
            @else
                <p class="text-gray-500 text-sm mb-3">No image uploaded.</p>
            @endif

            <input 
                type="file" 
                name="image" 
                class="w-full border rounded px-3 py-2"
            >
        </div>

        <div>
            <label class="block mb-1 font-medium">Position</label>
            <input 
                type="number" 
                name="position" 
                value="{{ old('position', $qr_category->position) }}"
                class="w-full border rounded px-3 py-2"
            >
        </div>

        <div class="flex gap-3">
            <button 
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Update Category
            </button>

            <a 
                href="{{ route('admin.qr-categories.index') }}"
                class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection