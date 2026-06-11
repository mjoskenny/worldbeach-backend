@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Menu Items</h1>

    <a href="{{ route('admin.menu-items.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block">+ Add Menu Item</a>

    @if(session('success'))
        <div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>
    @endif

    <table class="min-w-full bg-white shadow-md rounded">
        <thead>
            <tr class="bg-gray-100 border-b">
                <th class="py-2 px-4">Image</th>
                <th class="py-2 px-4">Name</th>
                <th class="py-2 px-4">Category</th>
                <th class="py-2 px-4">Price</th>
                <th class="py-2 px-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($menuItems as $item)
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-2 px-4">
                        @if($item->image)
                            <img src="{{ $item->display_image_url ?? $item->image }}" alt="" class="h-16 w-16 object-cover rounded">
                        @endif
                    </td>
                    <td class="py-2 px-4">{{ $item->name }}</td>
                    <td class="py-2 px-4">{{ $item->category->name ?? '-' }}</td>
                    <td class="py-2 px-4">${{ number_format($item->price, 2) }}</td>
                    <td class="py-2 px-4 flex space-x-2">
                        <a href="{{ route('admin.menu-items.edit', $item->id) }}" class="text-blue-500 hover:underline">Edit</a>
                        <form method="POST" action="{{ route('admin.menu-items.destroy', $item->id) }}">
                            @csrf @method('DELETE')
                            <button class="text-red-500 hover:underline">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
