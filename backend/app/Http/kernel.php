<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Routing\Middleware\SubstituteBindings;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        TrustProxies::class, // Middleware to trust proxies, typically for reverse proxies like nginx
        \Illuminate\Http\Middleware\HandleCors::class, // Built-in CORS middleware for Laravel 12
        PreventRequestsDuringMaintenance::class, // Middleware to check if app is in maintenance mode
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class, // Validate post size
        \Illuminate\Session\Middleware\StartSession::class, // Starts a session if needed
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class, // Add cookies to response
        \Illuminate\Session\Middleware\AuthenticateSession::class, // Ensure session is authenticated
        \Illuminate\Http\Middleware\SetCacheHeaders::class, // Set cache headers for responses
        SubstituteBindings::class, // Route model binding support
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            EncryptCookies::class, // Encrypt cookies for web routes
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class, // Manage queued cookies
            \Illuminate\Session\Middleware\StartSession::class, // Start session in web group
            SubstituteBindings::class, // Enable route model bindings
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, // Ensure stateful frontend requests with Sanctum
            'throttle:api', // Rate limit API requests
            SubstituteBindings::class, // Route model binding for API
        ],
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => Authenticate::class, // Middleware to ensure the user is authenticated
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class, // Basic authentication middleware
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class, // Set cache headers
        'can' => \Illuminate\Auth\Middleware\Authorize::class, // Authorize middleware to check permissions
        'guest' => RedirectIfAuthenticated::class, // Redirect if the user is already authenticated
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class, // Ensure password confirmation for sensitive routes
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class, // Middleware to validate signed URLs
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class, // Middleware for rate limiting
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class, // Middleware to ensure email verification
    ];
}
