<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category');

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(
            MenuItem::with('category')->findOrFail($id)
        );
    }
}
