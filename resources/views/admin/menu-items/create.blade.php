@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Add Menu Item</h1>

    @if ($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
            <p class="font-semibold mb-2">Please fix the errors below:</p>
            <ul class="list-disc list-inside">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.menu-items.store') }}" enctype="multipart/form-data" class="bg-white p-6 rounded shadow-md">
        @csrf
        <label class="block mb-2 font-medium">Name</label>
        <input type="text" name="name" value="{{ old('name') }}" class="border rounded w-full p-2 mb-4" required>
        @error('name')<p class="text-red-600 text-sm mb-4">{{ $message }}</p>@enderror

        <label class="block mb-2 font-medium">Price</label>
        <input type="number" name="price" step="0.01" value="{{ old('price') }}" class="border rounded w-full p-2 mb-4" required>
        @error('price')<p class="text-red-600 text-sm mb-4">{{ $message }}</p>@enderror

        <div class="mb-4">
        <label for="variant_price" class="block text-gray-700 font-medium mb-2">Variant Price (optional)</label>
        <input type="number" step="0.01" name="variant_price" id="variant_price" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter variant price (e.g., per shot)">
        </div>


        <label class="block mb-2 font-medium">Category</label>
        <select name="category_id" class="border rounded w-full p-2 mb-4" required>
            <option value="">Select category</option>
            @foreach($categories as $category)
                <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
            @endforeach
        </select>
        @error('category_id')<p class="text-red-600 text-sm mb-4">{{ $message }}</p>@enderror

        <label class="block mb-2 font-medium">Image</label>
        <input type="file" name="image" class="border rounded w-full p-2 mb-4">
        @error('image')<p class="text-red-600 text-sm mb-4">{{ $message }}</p>@enderror

        <div class="mb-4">
        <label for="description" class="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea name="description" id="description" rows="3" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">{{ old('description') }}</textarea>
        @error('description')<p class="text-red-600 text-sm mb-4">{{ $message }}</p>@enderror
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
        <a href="{{ route('admin.menu-items.index') }}" class="ml-2 text-gray-600 hover:underline">Cancel</a>
    </form>
</div>
@endsection
