<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\QrCategoryController;
use App\Http\Controllers\Admin\QrMenuItemController;
use App\Models\Table;
use App\Models\Gallery;
use App\Models\SiteSetting;
use App\Http\Controllers\Admin\TableController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/', function () {
    return view('welcome');
});

use App\Models\QrCategory;

Route::get('/qr-menu', function (Request $request) {
    if ($request->filled('table')) {
        $table = Table::where('table_number', $request->query('table'))->first();
        if ($table) {
            session([
                'table_id' => $table->id,
                'table_number' => $table->table_number,
            ]);
        }
    }

    $categories = QrCategory::with('menuItems')
        ->orderBy('position')
        ->get();

    $qrCarouselCategories = ['qr_menu_carousel', 'qr menu carousel', 'QR Menu Carousel', 'carousel'];

    $heroCarouselImages = Gallery::query()
        ->whereIn('category', $qrCarouselCategories)
        ->whereNotNull('image')
        ->orderBy('position')
        ->orderByDesc('created_at')
        ->limit(6)
        ->pluck('image');

    if ($heroCarouselImages->isEmpty()) {
        $heroCarouselImages = Gallery::query()
            ->whereNotNull('image')
            ->whereNotIn('category', $qrCarouselCategories)
            ->orderBy('position')
            ->orderByDesc('created_at')
            ->limit(6)
            ->pluck('image');
    }

    $heroCarouselImages = $heroCarouselImages->all();

    $siteLogo = SiteSetting::query()->value('logo_path');
    $qrLogoLight = $siteLogo ?: \Illuminate\Support\Facades\Vite::asset('resources/js/assets/d4a16e8ef77a867b8280234ddb8f940ade2e365a.png');
    $qrLogoDark = $siteLogo ?: \Illuminate\Support\Facades\Vite::asset('resources/js/assets/e4ffdc192823569086515323ccd66b5354680a76.png');

    return view('menu', compact('categories', 'heroCarouselImages', 'qrLogoLight', 'qrLogoDark'));
});



// ------------------------------
// User Dashboard (non-admin)
// ------------------------------
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ------------------------------
// Profile Routes
// ------------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// ------------------------------
// Admin Routes
// ------------------------------
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Admin Dashboard
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

    // Categories CRUD
    Route::resource('categories', CategoryController::class)->names([
        'index' => 'categories.index',
        'create' => 'categories.create',
        'store' => 'categories.store',
        'show' => 'categories.show',
        'edit' => 'categories.edit',
        'update' => 'categories.update',
        'destroy' => 'categories.destroy',
    ]);

    // Menu Items CRUD
    Route::resource('menu-items', MenuItemController::class)->names([
        'index' => 'menu-items.index',
        'create' => 'menu-items.create',
        'store' => 'menu-items.store',
        'show' => 'menu-items.show',
        'edit' => 'menu-items.edit',
        'update' => 'menu-items.update',
        'destroy' => 'menu-items.destroy',
    ]);

    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->only(['index'])->names([
    'index' => 'users.index',
]);

    // Tables CRUD
    Route::resource('tables', TableController::class)->names([
        'index' => 'tables.index',
        'create' => 'tables.create',
        'store' => 'tables.store',
        'show' => 'tables.show',
        'edit' => 'tables.edit',
        'update' => 'tables.update',
        'destroy' => 'tables.destroy',
    ]);

});
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // QR Categories
    Route::resource('qr-categories', QrCategoryController::class);

    // QR Menu Items
    Route::resource('qr-menu-items', QrMenuItemController::class);

});


require __DIR__ . '/auth.php';

Route::view('/{any}', 'app')->where('any', '.*');
