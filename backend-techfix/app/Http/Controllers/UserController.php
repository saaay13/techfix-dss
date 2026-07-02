<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $query = User::with('role')
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->when(request('role_id'), fn($q, $v) => $q->where('role_id', $v))
            ->when(request()->has('activo'), fn($q) => $q->where('activo', request('activo')));

        $perPage = request('per_page');
        return response()->json($perPage ? $query->paginate($perPage) : $query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'role_id' => 'required|exists:roles,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json($user->load('role'), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('role'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'apellido' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'role_id' => 'exists:roles,id',
            'activo' => 'boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user->load('role'));
    }

    public function destroy(User $user)
    {
        $user->update(['activo' => false]);

        return response()->json(['message' => 'Usuario desactivado']);
    }
}
