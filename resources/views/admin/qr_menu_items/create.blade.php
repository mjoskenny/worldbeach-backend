@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-6">Add QR Menu Item</h1>

    <form 
        action="{{ route('admin.qr-menu-items.store') }}" 
        method="POST" 
        enctype="multipart/form-data"
        class="bg-white p-6 rounded shadow space-y-5"
    >
        @csrf

        {{-- Category --}}
        <div>
            <label class="block mb-1 font-medium">Category</label>
            <select 
                name="qr_category_id" 
                class="w-full border rounded px-3 py-2"
                required
            >
                <option value="">Select category</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>

        {{-- Item Name --}}
        <div>
            <label class="block mb-1 font-medium">Item Name</label>
            <input 
                type="text" 
                name="name"
                class="w-full border rounded px-3 py-2"
                required
            >
        </div>

        {{-- Description --}}
        <div>
            <label class="block mb-1 font-medium">Description</label>
            <textarea 
                name="description"
                rows="4"
                class="w-full border rounded px-3 py-2"
                placeholder="Optional item description"
            ></textarea>
        </div>

        {{-- Price --}}
        <div>
            <label class="block mb-1 font-medium">Price (Fbu)</label>
            <input 
                type="number" 
                name="price"
                class="w-full border rounded px-3 py-2"
                min="0"
            >
        </div>

        {{-- Image --}}
        <div>
            <label class="block mb-1 font-medium">Item Image</label>
            <input 
                type="file" 
                name="image"
                class="w-full border rounded px-3 py-2"
                required
            >
        </div>

        {{-- Featured --}}
        <div class="flex items-center gap-3">
            <input 
                type="checkbox" 
                name="is_featured" 
                value="1"
                id="featured"
                class="w-4 h-4"
            >
            <label for="featured" class="font-medium">
                Mark as Featured Item
            </label>
        </div>

        {{-- Position --}}
        <div>
            <label class="block mb-1 font-medium">Display Position</label>
            <input 
                type="number" 
                name="position"
                value="0"
                class="w-full border rounded px-3 py-2"
            >
        </div>

        {{-- Buttons --}}
        <div class="flex gap-3 pt-2">
            <button 
                type="submit"
                class="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
            >
                Save Menu Item
            </button>

            <a 
                href="{{ route('admin.qr-menu-items.index') }}"
                class="bg-gray-300 text-black px-5 py-2 rounded hover:bg-gray-400"
            >
                Cancel
            </a>
        </div>

    </form>
</div>
@endsection