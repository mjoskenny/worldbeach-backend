@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-6">Edit QR Menu Item</h1>

    <form 
        action="{{ route('admin.qr-menu-items.update', $qr_menu_item->id) }}" 
        method="POST" 
        enctype="multipart/form-data"
        class="bg-white p-6 rounded shadow space-y-5"
    >
        @csrf
        @method('PUT')

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
                    <option 
                        value="{{ $category->id }}"
                        {{ old('qr_category_id', $qr_menu_item->qr_category_id) == $category->id ? 'selected' : '' }}
                    >
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
                value="{{ old('name', $qr_menu_item->name) }}"
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
            >{{ old('description', $qr_menu_item->description) }}</textarea>
        </div>

        {{-- Price --}}
        <div>
            <label class="block mb-1 font-medium">Price (Fbu)</label>
            <input 
                type="number" 
                name="price"
                value="{{ old('price', $qr_menu_item->price) }}"
                class="w-full border rounded px-3 py-2"
                min="0"
            >
        </div>

        {{-- Current Image --}}
        <div>
            <label class="block mb-1 font-medium">Current Image</label>

            @if($qr_menu_item->image)
                <div class="mb-3">
                    <img 
                        src="{{ asset('storage/' . $qr_menu_item->image) }}" 
                        alt="{{ $qr_menu_item->name }}"
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

        {{-- Featured --}}
        <div class="flex items-center gap-3">
            <input 
                type="checkbox" 
                name="is_featured" 
                value="1"
                id="featured"
                class="w-4 h-4"
                {{ old('is_featured', $qr_menu_item->is_featured) ? 'checked' : '' }}
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
                value="{{ old('position', $qr_menu_item->position) }}"
                class="w-full border rounded px-3 py-2"
            >
        </div>

        {{-- Buttons --}}
        <div class="flex gap-3 pt-2">
            <button 
                type="submit"
                class="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
            >
                Update Menu Item
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