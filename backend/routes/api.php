<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Debug middleware untuk login only
Route::middleware(['App\Http\Middleware\DebugRequest'])->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('divisions', [DivisionController::class, 'index']); // Tugas 2
    Route::post('divisions', [DivisionController::class, 'store']); // Create division
    Route::put('divisions/{id}', [DivisionController::class, 'update']); // Update division
    Route::delete('divisions/{id}', [DivisionController::class, 'destroy']); // Delete division
    
    Route::get('employees', [EmployeeController::class, 'index']); // Tugas 3
    Route::post('employees', [EmployeeController::class, 'store']); // Tugas 4
    Route::put('employees/{id}', [EmployeeController::class, 'update']); // Tugas 5
    Route::delete('employees/{id}', [EmployeeController::class, 'destroy']); // Tugas 6
    Route::post('logout', [AuthController::class, 'logout']); // Tugas 7
    
    // User profile routes
    Route::get('profile', [UserController::class, 'profile']);
    Route::put('profile', [UserController::class, 'updateProfile']);
});
