<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    // Show all tables
    public function index()
    {
        $tables = Table::latest()->get();
        return view('admin.tables.index', compact('tables'));
    }

    // Show create form
    public function create()
    {
        return view('admin.tables.create');
    }

    // Save new table
    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|unique:tables|integer',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,occupied,reserved,maintenance',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        Table::create([
            'table_number' => $request->table_number,
            'capacity' => $request->capacity,
            'status' => $request->status,
            'location' => $request->location,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.tables.index')->with('success', 'Table added successfully!');
    }

    // Show edit form
    public function edit(Table $table)
    {
        return view('admin.tables.edit', compact('table'));
    }

    // Update table
    public function update(Request $request, Table $table)
    {
        $request->validate([
            'table_number' => 'required|integer|unique:tables,table_number,' . $table->id,
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,occupied,reserved,maintenance',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $table->update([
            'table_number' => $request->table_number,
            'capacity' => $request->capacity,
            'status' => $request->status,
            'location' => $request->location,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.tables.index')->with('success', 'Table updated successfully!');
    }

    // Delete table
    public function destroy(Table $table)
    {
        $table->delete();
        return redirect()->route('admin.tables.index')->with('success', 'Table deleted successfully!');
    }
}
