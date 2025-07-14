<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('login', [AuthController::class, 'login']);

// Public read-only endpoints (no auth required)
Route::get('divisions', [DivisionController::class, 'index']); // Public read
Route::get('employees', [EmployeeController::class, 'index']); // Public read

// Test authentication endpoint
Route::middleware('auth:sanctum')->get('auth-test', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Authentication working',
        'user' => $request->user(),
        'token_abilities' => $request->user()->currentAccessToken()->abilities ?? [],
    ]);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Division management (add/edit only, no delete)
    Route::post('divisions', [DivisionController::class, 'store']); // Create division
    Route::put('divisions/{id}', [DivisionController::class, 'update']); // Update division
    
    // Employee management (full CRUD)
    Route::post('employees', [EmployeeController::class, 'store']); // Tugas 4
    Route::put('employees/{id}', [EmployeeController::class, 'update']); // Tugas 5
    Route::delete('employees/{id}', [EmployeeController::class, 'destroy']); // Tugas 6
    Route::post('logout', [AuthController::class, 'logout']); // Tugas 7
    
    // User profile routes
    Route::get('profile', [UserController::class, 'profile']);
    Route::put('profile', [UserController::class, 'updateProfile']);
});
