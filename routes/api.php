<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);

use App\Http\Controllers\Api\Admin\MenuItemController as AdminMenuItemController;

Route::middleware(['web', 'auth', 'admin'])->prefix('admin')->group(function () {
    Route::post('/menu-items', [AdminMenuItemController::class, 'store']);
    Route::put('/menu-items/{id}', [AdminMenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [AdminMenuItemController::class, 'destroy']);
});



// Admin routes (protected with auth:sanctum or other middleware)
Route::middleware(['web', 'auth', 'admin'])->prefix('admin')->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});


// routes/api.php
use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\EventTicketOrderController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\HostEventRequestController;
use App\Http\Controllers\Api\SiteSettingController;

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::post('/event-ticket-orders', [EventTicketOrderController::class, 'store']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::post('/host-event-requests', [HostEventRequestController::class, 'store']);
Route::get('/settings', [SiteSettingController::class, 'show']);

use App\Http\Controllers\Api\SpaceController;

Route::get('/spaces', [SpaceController::class, 'index']);
Route::get('/spaces/{space}', [SpaceController::class, 'show']);

// Order routes
use App\Http\Controllers\Api\OrderController;

Route::middleware('web')->group(function () {
    Route::get('/session-data', [OrderController::class, 'getSessionData']); // Get table info from QR session
});
Route::post('/orders', [OrderController::class, 'store']); // Create new order
Route::get('/orders/{orderId}', [OrderController::class, 'show']); // Get order by ID


use App\Http\Controllers\ServiceController;

Route::get('/services', [ServiceController::class, 'index']);



use App\Http\Controllers\GalleryController;

Route::get('/gallery-data', [GalleryController::class, 'index']);

Route::middleware('web')->prefix('admin/auth')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('guest');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->middleware('auth');
    Route::get('/me', [AdminAuthController::class, 'me']);
});

Route::middleware(['web', 'auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::put('/reservations/{reservationId}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservationId}', [ReservationController::class, 'destroy']);
    Route::get('/host-event-requests', [HostEventRequestController::class, 'index']);
    Route::put('/host-event-requests/{requestId}', [HostEventRequestController::class, 'update']);
    Route::delete('/host-event-requests/{requestId}', [HostEventRequestController::class, 'destroy']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    Route::put('/settings', [SiteSettingController::class, 'update']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{orderId}/status', [OrderController::class, 'updateStatus']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    Route::post('/spaces', [SpaceController::class, 'store']);
    Route::post('/spaces/{space}', [SpaceController::class, 'update']);
    Route::delete('/spaces/{space}', [SpaceController::class, 'destroy']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::post('/gallery/{id}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
    Route::get('/notifications', [AdminNotificationController::class, 'index']);
    Route::get('/notifications/stream', [AdminNotificationController::class, 'stream']);
    Route::patch('/notifications/read-all', [AdminNotificationController::class, 'markAllRead']);
    Route::delete('/notifications/clear', [AdminNotificationController::class, 'clear']);
    Route::patch('/notifications/{notification}/read', [AdminNotificationController::class, 'markRead']);
    Route::delete('/notifications/{notification}', [AdminNotificationController::class, 'destroy']);
});
