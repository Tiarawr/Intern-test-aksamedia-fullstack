<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for Cross-Origin Resource Sharing
    | or "CORS". By default, all paths are allowed with any origin and
    | headers. You can adjust these settings to suit your needs.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Apply CORS to all routes starting with '/api'

    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://*.vercel.app',
        'https://*.railway.app',
        'https://intern-test-aksamedia-fullstack-production.up.railway.app',
    ], // Allow specific origins for development and production

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers; you can customize this if necessary

    'exposed_headers' => [], // Specify headers to be exposed to the client-side JavaScript (optional)

    'max_age' => 0, // Cache the preflight OPTIONS request for a limited time

    'supports_credentials' => true, // Set to true if you want to allow cookies/authorization headers
];
