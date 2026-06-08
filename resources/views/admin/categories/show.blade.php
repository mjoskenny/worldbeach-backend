@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Category Details</h1>

    <div class="bg-white p-6 rounded shadow-md">
        <p><strong>Name:</strong> {{ $category->name }}</p>
        <p class="mt-4">
            <a href="{{ route('admin.categories.index') }}" class="text-blue-500 hover:underline">← Back to Categories</a>
        </p>
    </div>
</div>
@endsection
