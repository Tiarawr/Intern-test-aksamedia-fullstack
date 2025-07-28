<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class NormalizeJson
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->isJson() && $request->getContent()) {
            $content = $request->getContent();

            // Clean trailing commas from JSON
            $cleanedContent = preg_replace('/,\s*}/', '}', $content);
            $cleanedContent = preg_replace('/,\s*]/', ']', $cleanedContent);

            // Only replace if content changed
            if ($content !== $cleanedContent) {
                // Create new request instance with cleaned JSON
                $request->merge(json_decode($cleanedContent, true) ?: []);
            }
        }

        return $next($request);
    }
}
