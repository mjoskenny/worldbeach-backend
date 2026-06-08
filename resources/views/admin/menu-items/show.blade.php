@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Menu Item Details</h1>

    <div class="bg-white p-6 rounded shadow-md">
        @if($menuItem->image)
            <img src="{{ asset('storage/' . $menuItem->image) }}" alt="" class="h-32 w-32 object-cover rounded mb-4">
        @endif
        <p><strong>Name:</strong> {{ $menuItem->name }}</p>
        <p><strong>Category:</strong> {{ $menuItem->category->name ?? '-' }}</p>
        <p><strong>Price:</strong> ${{ number_format($menuItem->price, 2) }}</p>
        <p class="mt-4">
            <a href="{{ route('admin.menu-items.index') }}" class="text-blue-500 hover:underline">← Back to Menu Items</a>
        </p>
    </div>
</div>
@endsection
