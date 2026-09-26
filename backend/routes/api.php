<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\CustomRequestController;
use App\Http\Controllers\Api\AdminDashboardController;

// Auth Routes (RF-001 - RF-005)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::put('/auth/profile/{id}', [AuthController::class, 'updateProfile']);
Route::post('/auth/addresses/{userId}', [AuthController::class, 'addAddress']);

// Catalog & Products (RF-008 - RF-017, RF-129, RF-130)
Route::get('/home', [ProductController::class, 'homeData']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::post('/products/{id}/reviews', [ProductController::class, 'addReview']);
Route::post('/favorites/toggle', [ProductController::class, 'toggleFavorite']);
Route::get('/categories', [ProductController::class, 'categories']);
Route::post('/categories', [ProductController::class, 'storeCategory']);
Route::put('/categories/{id}', [ProductController::class, 'updateCategory']);
Route::delete('/categories/{id}', [ProductController::class, 'destroyCategory']);

// Orders (RF-026 - RF-053, RF-097 - RF-100)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::get('/users/{userId}/orders', [OrderController::class, 'userOrders']);
Route::get('/admin/orders', [OrderController::class, 'adminOrders']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// Collections / Clothing Donations (RF-054 - RF-060, RF-071 - RF-075, RF-101 - RF-105)
Route::post('/collections', [CollectionController::class, 'store']);
Route::get('/collections', [CollectionController::class, 'index']);
Route::get('/users/{userId}/collections', [CollectionController::class, 'userCollections']);
Route::put('/collections/{id}/assign', [CollectionController::class, 'assign']);
Route::put('/collections/{id}/classify', [CollectionController::class, 'classify']);

// Production Orders (RF-076 - RF-085)
Route::get('/production-orders', [ProductionController::class, 'index']);
Route::post('/production-orders', [ProductionController::class, 'store']);
Route::put('/production-orders/{id}/progress', [ProductionController::class, 'updateProgress']);
Route::put('/production-orders/{id}/complete', [ProductionController::class, 'completeAndStock']);

// Custom Requests / Personalización (RF-066 - RF-070)
Route::post('/custom-requests', [CustomRequestController::class, 'store']);
Route::get('/custom-requests', [CustomRequestController::class, 'index']);
Route::put('/custom-requests/{id}/status', [CustomRequestController::class, 'updateStatus']);

// Admin Dashboard & Master Tables (RF-106 - RF-127, RF-131 - RF-133)
Route::get('/admin/stats', [AdminDashboardController::class, 'stats']);
Route::get('/admin/users', [AdminDashboardController::class, 'users']);
Route::post('/admin/users', [AdminDashboardController::class, 'storeUser']);
Route::put('/admin/users/{id}/status', [AdminDashboardController::class, 'updateUserStatus']);
Route::get('/admin/branches', [AdminDashboardController::class, 'branches']);
Route::post('/admin/branches', [AdminDashboardController::class, 'storeBranch']);
Route::get('/admin/delivery-zones', [AdminDashboardController::class, 'deliveryZones']);
Route::post('/admin/delivery-zones', [AdminDashboardController::class, 'storeDeliveryZone']);
Route::get('/admin/coupons', [AdminDashboardController::class, 'coupons']);
Route::post('/admin/coupons', [AdminDashboardController::class, 'storeCoupon']);
Route::get('/admin/reviews', [AdminDashboardController::class, 'reviews']);
Route::put('/admin/reviews/{id}/toggle', [AdminDashboardController::class, 'toggleReviewApproval']);
Route::get('/admin/reports', [AdminDashboardController::class, 'reports']);
