@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Add Menu Item</h1>

    <form method="POST" action="{{ route('admin.menu-items.store') }}" enctype="multipart/form-data" class="bg-white p-6 rounded shadow-md">
        @csrf
        <label class="block mb-2 font-medium">Name</label>
        <input type="text" name="name" class="border rounded w-full p-2 mb-4" required>

        <label class="block mb-2 font-medium">Price</label>
        <input type="number" name="price" step="0.01" class="border rounded w-full p-2 mb-4" required>

        <div class="mb-4">
        <label for="variant_price" class="block text-gray-700 font-medium mb-2">Variant Price (optional)</label>
        <input type="number" step="0.01" name="variant_price" id="variant_price" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter variant price (e.g., per shot)">
        </div>


        <label class="block mb-2 font-medium">Category</label>
        <select name="category_id" class="border rounded w-full p-2 mb-4" required>
            <option value="">Select category</option>
            @foreach($categories as $category)
                <option value="{{ $category->id }}">{{ $category->name }}</option>
            @endforeach
        </select>

        <label class="block mb-2 font-medium">Image</label>
        <input type="file" name="image" class="border rounded w-full p-2 mb-4">

        <div class="mb-4">
        <label for="description" class="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea name="description" id="description" rows="3" class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">{{ old('description') }}</textarea>
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
        <a href="{{ route('admin.menu-items.index') }}" class="ml-2 text-gray-600 hover:underline">Cancel</a>
    </form>
</div>
@endsection
