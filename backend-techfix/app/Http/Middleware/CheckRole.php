<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if (!in_array($user->role->nombre, $roles)) {
            return response()->json(['message' => 'No tienes permiso para esta acción'], 403);
        }

        return $next($request);
    }
}
