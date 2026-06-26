<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin()
    {
        $role = Role::factory()->create(['nombre' => 'Administrador']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'password' => bcrypt('12345678'),
        ]);

        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        return $login->json('token');
    }

    public function test_index_returns_users(): void
    {
        $token = $this->actingAsAdmin();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([['id', 'name', 'email', 'role']]);
    }

    public function test_store_creates_user(): void
    {
        $token = $this->actingAsAdmin();
        $role = Role::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/users', [
                'name' => 'Juan',
                'apellido' => 'Perez',
                'email' => 'juan@test.com',
                'password' => '12345678',
                'telefono' => '70000001',
                'role_id' => $role->id,
            ]);

        $response->assertStatus(201)
            ->assertJson(['name' => 'Juan', 'email' => 'juan@test.com']);
    }

    public function test_store_validates_required_fields(): void
    {
        $token = $this->actingAsAdmin();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'apellido', 'email', 'password', 'role_id']);
    }

    public function test_show_returns_user(): void
    {
        $token = $this->actingAsAdmin();
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson(['id' => $user->id]);
    }

    public function test_update_modifies_user(): void
    {
        $token = $this->actingAsAdmin();
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/users/{$user->id}", [
                'name' => 'Pedro',
            ]);

        $response->assertStatus(200)
            ->assertJson(['name' => 'Pedro']);
    }

    public function test_destroy_deactivates_user(): void
    {
        $token = $this->actingAsAdmin();
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'activo' => false]);
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }
}
