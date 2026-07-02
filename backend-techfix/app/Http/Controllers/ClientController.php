<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    public function index()
    {
        $query = Client::query()
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->when(request()->has('activo'), fn($q) => $q->where('activo', request('activo')))
            ->orderBy('id', 'desc');

        $clients = $query->paginate(10);

        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'correo'   => 'required|email|max:255|unique:clients,correo',
            'ci'       => 'required|string|max:20|unique:clients,ci',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'correo'   => ['required', 'email', 'max:255', Rule::unique('clients', 'correo')->ignore($client->id)],
            'ci'       => ['required', 'string', 'max:20', Rule::unique('clients', 'ci')->ignore($client->id)],
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->update(['activo' => false]);

        return response()->json(['message' => 'Cliente desactivado correctamente']);
    }
}
