<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authHeaders(): array
    {
        $role = Role::factory()->create(['nombre' => 'Administrador']);
        $user = User::factory()->create(['role_id' => $role->id]);
        $token = $user->createToken('test')->plainTextToken;
        return ['Authorization' => 'Bearer ' . $token];
    }

    public function test_can_list_clients(): void
    {
        Client::factory()->count(3)->create();

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/clients');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'per_page', 'total']);
    }

    public function test_can_create_client(): void
    {
        $payload = [
            'nombre'   => 'Juan',
            'apellido' => 'Perez',
            'telefono' => '77123456',
            'correo'   => 'juan@example.com',
            'ci'       => '1234567',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/clients', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['nombre' => 'Juan']);
    }

    public function test_requires_all_fields(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/clients', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre', 'apellido', 'telefono', 'correo', 'ci']);
    }

    public function test_requires_valid_email(): void
    {
        $payload = [
            'nombre'   => 'Juan',
            'apellido' => 'Perez',
            'telefono' => '77123456',
            'correo'   => 'invalido',
            'ci'       => '1234567',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/clients', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['correo']);
    }

    public function test_rejects_duplicate_email(): void
    {
        Client::factory()->create(['correo' => 'juan@example.com']);

        $payload = [
            'nombre'   => 'Maria',
            'apellido' => 'Lopez',
            'telefono' => '77123457',
            'correo'   => 'juan@example.com',
            'ci'       => '7654321',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/clients', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['correo']);
    }

    public function test_can_show_client(): void
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->getJson("/api/clients/{$client->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['nombre' => $client->nombre]);
    }

    public function test_can_update_client(): void
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/clients/{$client->id}", [
                'nombre'   => 'Actualizado',
                'apellido' => $client->apellido,
                'telefono' => $client->telefono,
                'correo'   => $client->correo,
                'ci'       => $client->ci,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['nombre' => 'Actualizado']);
    }

    public function test_can_destroy_client(): void
    {
        $client = Client::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/clients/{$client->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Cliente desactivado correctamente']);

        $this->assertDatabaseHas('clients', ['id' => $client->id, 'activo' => false]);
    }
}
