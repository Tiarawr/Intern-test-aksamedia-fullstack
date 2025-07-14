<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API is running!',
        'timestamp' => now(),
        'environment' => app()->environment(),
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => 'connected',
        'timestamp' => now(),
    ]);
});
