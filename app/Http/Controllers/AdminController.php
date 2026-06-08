<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        // Count data for dashboard cards
        $totalCategories = Category::count();
        $totalMenuItems = MenuItem::count();
        $totalUsers = User::count();
        $sidebarExpanded = true; // or false depending on your layout
        

        return view('admin.dashboard', compact(
            'sidebarExpanded',
            'totalCategories',
            'totalMenuItems',
            'totalUsers'
        ));
    }
}
