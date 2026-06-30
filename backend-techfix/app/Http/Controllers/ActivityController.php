<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(): JsonResponse
    {
        $activities = Activity::active()->orderBy('nombre')->get();
        return response()->json($activities);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:activities,nombre',
        ]);

        $activity = Activity::create($validated);
        return response()->json($activity, 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        return response()->json($activity);
    }

    public function update(Request $request, Activity $activity): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:activities,nombre,' . $activity->id,
            'activo' => 'boolean',
        ]);

        $activity->update($validated);
        return response()->json($activity);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->update(['activo' => false]);
        return response()->json(['message' => 'Actividad desactivada']);
    }
}
