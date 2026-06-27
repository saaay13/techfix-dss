<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin()
    {
        $role = Role::factory()->create(['nombre' => 'Administrador']);
        return User::factory()->create([
            'role_id' => $role->id,
            'password' => bcrypt('12345678'),
        ]);
    }

    private function createTecnico()
    {
        $role = Role::factory()->create(['nombre' => 'Técnico']);
        return User::factory()->create([
            'role_id' => $role->id,
            'password' => bcrypt('12345678'),
        ]);
    }

    private function loginAs(User $user): string
    {
        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);
        return $login->json('token');
    }

    public function test_admin_can_access_users(): void
    {
        $token = $this->loginAs($this->createAdmin());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_tecnico_cannot_access_users(): void
    {
        $token = $this->loginAs($this->createTecnico());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/users');

        $response->assertStatus(403)
            ->assertJson(['message' => 'No tienes permiso para esta acción']);
    }

    public function test_tecnico_can_access_clients(): void
    {
        $token = $this->loginAs($this->createTecnico());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/clients');

        $response->assertStatus(200);
    }

    public function test_admin_can_access_roles(): void
    {
        $token = $this->loginAs($this->createAdmin());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/roles');

        $response->assertStatus(200);
    }

    public function test_tecnico_cannot_access_roles(): void
    {
        $token = $this->loginAs($this->createTecnico());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/roles');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_anything(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);

        $response = $this->getJson('/api/clients');
        $response->assertStatus(401);
    }

    public function test_admin_can_create_user(): void
    {
        $token = $this->loginAs($this->createAdmin());
        $role = Role::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/users', [
                'name' => 'Nuevo',
                'apellido' => 'Usuario',
                'email' => 'nuevo@test.com',
                'password' => '12345678',
                'role_id' => $role->id,
            ]);

        $response->assertStatus(201);
    }

    public function test_tecnico_cannot_create_user(): void
    {
        $token = $this->loginAs($this->createTecnico());
        $role = Role::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/users', [
                'name' => 'Nuevo',
                'apellido' => 'Usuario',
                'email' => 'nuevo@test.com',
                'password' => '12345678',
                'role_id' => $role->id,
            ]);

        $response->assertStatus(403);
    }

    public function test_tecnico_cannot_access_financial_reports(): void
    {
        $token = $this->loginAs($this->createTecnico());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/reports/financial');

        $response->assertStatus(403);
    }

    public function test_tecnico_cannot_access_income_dashboard(): void
    {
        $token = $this->loginAs($this->createTecnico());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/dashboard/income');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_financial_reports(): void
    {
        $token = $this->loginAs($this->createAdmin());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/reports/financial');

        $response->assertStatus(200);
    }

    public function test_admin_can_access_income_dashboard(): void
    {
        $token = $this->loginAs($this->createAdmin());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/dashboard/income');

        $response->assertStatus(200);
    }
}
