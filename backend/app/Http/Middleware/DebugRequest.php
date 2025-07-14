<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DebugRequest
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Incoming Request Debug', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'content_type' => $request->header('Content-Type'),
            'raw_body' => $request->getContent(),
            'parsed_input' => $request->all(),
            'has_json' => $request->isJson(),
        ]);

        return $next($request);
    }
}
