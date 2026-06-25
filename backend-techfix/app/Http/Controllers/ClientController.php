<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::active()
            ->when(request('search'), fn($q, $s) => $q->search($s))
            ->orderBy('id', 'desc')
            ->paginate(10);

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
}
