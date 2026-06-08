<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\MenuItem;

class MenuController extends Controller
{
    public function index() {
        $categories = Category::all();
        $menuItems = MenuItem::with('category')->get();
        return view('menu', compact('categories','menuItems'));
    }
}

