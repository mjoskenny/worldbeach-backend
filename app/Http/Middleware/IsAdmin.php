<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->isAdmin()) {
            return $next($request);
        }

        return $request->expectsJson()
            ? response()->json(['message' => 'Admin access is required.'], 403)
            : redirect('/');
    }
}
