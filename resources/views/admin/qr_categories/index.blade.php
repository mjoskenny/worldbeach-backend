@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">QR Categories</h1>

    <a href="{{ route('admin.qr-categories.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block">
        + Add Category
    </a>

    @if(session('success'))
        <div class="bg-green-100 text-green-700 p-3 rounded mb-4">
            {{ session('success') }}
        </div>
    @endif

    <table class="min-w-full bg-white shadow-md rounded">
        <thead>
            <tr class="bg-gray-100 border-b">
                <th class="py-2 px-4">#</th>
                <th class="py-2 px-4">Image</th>
                <th class="py-2 px-4">Name</th>
                <th class="py-2 px-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($categories as $category)
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-2 px-4">{{ $loop->iteration }}</td>

                    <td class="py-2 px-4">
                        @if($category->image)
                            <img src="{{ $category->display_image_url }}" class="w-16 h-16 object-cover rounded">
                        @endif
                    </td>

                    <td class="py-2 px-4">{{ $category->name }}</td>

                    <td class="py-2 px-4 flex gap-3">
                        <a href="{{ route('admin.qr-categories.edit', $category->id) }}" class="text-blue-500">Edit</a>

                        <form method="POST" action="{{ route('admin.qr-categories.destroy', $category->id) }}">
                            @csrf @method('DELETE')
                            <button class="text-red-500">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection