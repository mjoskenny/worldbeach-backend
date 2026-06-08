@extends('admin.layouts.admin')

@section('title', 'Dashboard')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Total Categories -->
    <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div>
            <p class="text-gray-500">Total Categories</p>
            <h2 class="text-3xl font-bold">{{ $totalCategories }}</h2>
        </div>
        <div class="text-blue-500">
            <i data-feather="tag" class="w-10 h-10"></i>
        </div>
    </div>

    <!-- Total Menu Items -->
    <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div>
            <p class="text-gray-500">Total Menu Items</p>
            <h2 class="text-3xl font-bold">{{ $totalMenuItems }}</h2>
        </div>
        <div class="text-green-500">
            <i data-feather="coffee" class="w-10 h-10"></i>
        </div>
    </div>

    <!-- Total Users -->
    <div class="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div>
            <p class="text-gray-500">Total Users</p>
            <h2 class="text-3xl font-bold">{{ $totalUsers }}</h2>
        </div>
        <div class="text-purple-500">
            <i data-feather="users" class="w-10 h-10"></i>
        </div>
    </div>
</div>

<!-- Optional: Recent Activities or Quick Actions -->
<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
        <div class="flex flex-col gap-3">
            <a href="{{ route('admin.categories.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2">
                <i data-feather="plus"></i> Add Category
            </a>
           <a href="{{ route('admin.menu-items.create') }}" class="bg-green-500 text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2">
    <i data-feather="plus"></i> Add Menu Item
</a>

        </div>
    </div>
    <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
        <ul class="list-disc list-inside text-gray-600">
            <li>Category "Drinks" added 2 hours ago</li>
            <li>Menu item "Cappuccino" updated 3 hours ago</li>
            <li>User "John Doe" registered 1 day ago</li>
        </ul>
    </div>
</div>
@endsection
