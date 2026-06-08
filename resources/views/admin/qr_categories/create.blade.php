@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <h1 class="text-2xl font-bold mb-4">Add QR Category</h1>

    <form 
        action="{{ route('admin.qr-categories.store') }}" 
        method="POST" 
        enctype="multipart/form-data"
        class="bg-white p-6 rounded shadow space-y-4"
    >
        @csrf

        <div>
            <label class="block mb-1 font-medium">Category Name</label>
            <input 
                type="text" 
                name="name" 
                class="w-full border rounded px-3 py-2"
                required
            >
        </div>

        <div>
            <label class="block mb-1 font-medium">Category Image</label>
            <input 
                type="file" 
                name="image" 
                class="w-full border rounded px-3 py-2"
            >
        </div>

        <div>
            <label class="block mb-1 font-medium">Position</label>
            <input 
                type="number" 
                name="position" 
                value="0"
                class="w-full border rounded px-3 py-2"
            >
        </div>

        <button 
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Save Category
        </button>
    </form>
</div>
@endsection