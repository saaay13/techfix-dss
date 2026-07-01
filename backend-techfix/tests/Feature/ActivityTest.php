<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    private function loginAsAdmin(): string
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

    private function loginAsTecnico(): string
    {
        $role = Role::factory()->create(['nombre' => 'Técnico']);
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

    public function test_admin_can_list_activities(): void
    {
        $token = $this->loginAsAdmin();
        Activity::factory()->count(3)->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_admin_can_create_activity(): void
    {
        $token = $this->loginAsAdmin();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/activities', ['nombre' => 'Diagnóstico']);

        $response->assertStatus(201)
            ->assertJson(['nombre' => 'Diagnóstico']);
    }

    public function test_admin_can_update_activity(): void
    {
        $token = $this->loginAsAdmin();
        $activity = Activity::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/activities/{$activity->id}", ['nombre' => 'Cambio']);

        $response->assertStatus(200)
            ->assertJson(['nombre' => 'Cambio']);
    }

    public function test_admin_can_deactivate_activity(): void
    {
        $token = $this->loginAsAdmin();
        $activity = Activity::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/activities/{$activity->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('activities', ['id' => $activity->id, 'activo' => false]);
    }

    public function test_validate_unique_nombre(): void
    {
        $token = $this->loginAsAdmin();
        Activity::factory()->create(['nombre' => 'Reparación']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/activities', ['nombre' => 'Reparación']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }

    public function test_tecnico_cannot_access_activities(): void
    {
        $token = $this->loginAsTecnico();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/activities');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/activities');
        $response->assertStatus(401);
    }

    public function test_index_only_returns_active_activities(): void
    {
        $token = $this->loginAsAdmin();
        Activity::factory()->create(['nombre' => 'Activa', 'activo' => true]);
        Activity::factory()->create(['nombre' => 'Inactiva', 'activo' => false]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.nombre', 'Activa');
    }
}
