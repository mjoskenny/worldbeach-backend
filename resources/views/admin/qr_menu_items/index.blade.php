@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">

    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">QR Menu Items</h1>

        <a 
            href="{{ route('admin.qr-menu-items.create') }}" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            + Add Item
        </a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('success') }}
        </div>
    @endif

    @if($items->count())
        <div class="overflow-x-auto bg-white shadow-md rounded">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="py-3 px-4 text-left">#</th>
                        <th class="py-3 px-4 text-left">Image</th>
                        <th class="py-3 px-4 text-left">Name</th>
                        <th class="py-3 px-4 text-left">Category</th>
                        <th class="py-3 px-4 text-left">Price</th>
                        <th class="py-3 px-4 text-left">Featured</th>
                        <th class="py-3 px-4 text-left">Position</th>
                        <th class="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($items as $item)
                        <tr class="border-b hover:bg-gray-50">
                            <td class="py-3 px-4">{{ $loop->iteration }}</td>

                            <td class="py-3 px-4">
                                @if($item->image)
                                    <img 
                                        src="{{ $item->display_image_url }}" 
                                        alt="{{ $item->name }}"
                                        class="w-16 h-16 object-cover rounded"
                                    >
                                @else
                                    <span class="text-gray-400 text-sm">No image</span>
                                @endif
                            </td>

                            <td class="py-3 px-4">
                                <div class="font-medium">{{ $item->name }}</div>

                                @if($item->description)
                                    <p class="text-sm text-gray-500 mt-1">
                                        {{ \Illuminate\Support\Str::limit($item->description, 50) }}
                                    </p>
                                @endif
                            </td>

                            <td class="py-3 px-4">
                                {{ $item->category->name ?? 'N/A' }}
                            </td>

                            <td class="py-3 px-4">
                                {{ number_format($item->price) }} Fbu
                            </td>

                            <td class="py-3 px-4">
                                @if($item->is_featured)
                                    <span class="text-green-600 font-semibold">Yes</span>
                                @else
                                    <span class="text-gray-500">No</span>
                                @endif
                            </td>

                            <td class="py-3 px-4">
                                {{ $item->position }}
                            </td>

                            <td class="py-3 px-4">
                                <div class="flex gap-3">
                                    <a 
                                        href="{{ route('admin.qr-menu-items.edit', $item->id) }}" 
                                        class="text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </a>

                                    <form 
                                        method="POST" 
                                        action="{{ route('admin.qr-menu-items.destroy', $item->id) }}"
                                        onsubmit="return confirm('Delete this item?')"
                                    >
                                        @csrf
                                        @method('DELETE')

                                        <button 
                                            type="submit"
                                            class="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>

            </table>
        </div>
    @else
        <div class="bg-white shadow rounded p-6 text-center text-gray-500">
            No QR menu items yet.
        </div>
    @endif

</div>
@endsection