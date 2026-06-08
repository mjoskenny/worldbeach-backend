@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Restaurant Tables</h1>
        <a href="{{ route('admin.tables.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">+ Add Table</a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{{ session('success') }}</p>
        </div>
    @endif

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="w-full">
            <thead>
                <tr class="bg-gray-100 border-b">
                    <th class="text-left py-3 px-4 font-semibold">#</th>
                    <th class="text-left py-3 px-4 font-semibold">Table Number</th>
                    <th class="text-left py-3 px-4 font-semibold">Capacity</th>
                    <th class="text-left py-3 px-4 font-semibold">Location</th>
                    <th class="text-left py-3 px-4 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 font-semibold">QR Code</th>
                    <th class="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($tables as $table)
                    @php
                        $qrUrl = url('/qr-menu?table=' . $table->table_number);
                    @endphp
                    <tr class="border-b hover:bg-gray-50 transition">
                        <td class="py-3 px-4">{{ $loop->iteration }}</td>
                        <td class="py-3 px-4 font-semibold">{{ $table->table_number }}</td>
                        <td class="py-3 px-4">{{ $table->capacity }} seats</td>
                        <td class="py-3 px-4">{{ $table->location ?? 'N/A' }}</td>
                        <td class="py-3 px-4">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold
                                @if($table->status === 'available') bg-green-100 text-green-800
                                @elseif($table->status === 'occupied') bg-red-100 text-red-800
                                @elseif($table->status === 'reserved') bg-yellow-100 text-yellow-800
                                @else bg-gray-100 text-gray-800
                                @endif">
                                {{ ucfirst($table->status) }}
                            </span>
                        </td>
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-3">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ urlencode($qrUrl) }}" alt="Table {{ $table->table_number }} QR code" class="w-24 h-24 rounded-lg border" />
                            </div>
                            <div class="mt-2 text-xs text-gray-500">
                                <a href="{{ $qrUrl }}" target="_blank" class="underline">Open link</a> |
                                <a href="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ urlencode($qrUrl) }}" download="table-{{ $table->table_number }}-qr.png" class="underline">Download QR</a>
                            </div>
                        </td>
                        <td class="py-3 px-4 flex space-x-2">
                            <a href="{{ route('admin.tables.edit', $table->id) }}" class="text-blue-500 hover:text-blue-700 font-semibold">Edit</a>
                            <form method="POST" action="{{ route('admin.tables.destroy', $table->id) }}" class="inline" onsubmit="return confirm('Are you sure?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="py-4 px-4 text-center text-gray-500">No tables found. <a href="{{ route('admin.tables.create') }}" class="text-blue-500 hover:underline">Add one now</a></td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
