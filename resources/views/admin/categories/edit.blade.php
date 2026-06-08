@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Edit Category</h1>

    <form method="POST" action="{{ route('admin.categories.update', $category->id) }}" class="bg-white p-6 rounded shadow-md">
        @csrf @method('PUT')
        <label class="block mb-2 font-medium">Category Name</label>
        <input type="text" name="name" value="{{ old('name', $category->name) }}" class="border rounded w-full p-2 mb-4" required>

        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
        <a href="{{ route('admin.categories.index') }}" class="ml-2 text-gray-600 hover:underline">Cancel</a>
    </form>
</div>
@endsection
