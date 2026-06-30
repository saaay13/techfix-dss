<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceTypeApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $tech;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['nombre' => 'Administrador']);
        $techRole = Role::factory()->create(['nombre' => 'Técnico']);

        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
        $this->tech = User::factory()->create(['role_id' => $techRole->id]);
    }

    public function test_admin_can_create_service_type(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/service-types', [
            'nombre' => 'Reparación de pantalla',
            'descripcion' => 'Cambio de pantalla en laptops',
            'precio' => 250.00,
        ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Tipo de servicio creado exitosamente.']);

        $this->assertDatabaseHas('service_types', [
            'nombre' => 'Reparación de pantalla',
            'precio' => 250.00,
        ]);
    }

    public function test_non_admin_cannot_create_service_type(): void
    {
        $response = $this->actingAs($this->tech)->postJson('/api/service-types', [
            'nombre' => 'Reparación',
            'precio' => 100,
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_service_type(): void
    {
        $type = ServiceType::factory()->create();

        $response = $this->actingAs($this->admin)->putJson("/api/service-types/{$type->id}", [
            'nombre' => 'Nombre actualizado',
            'descripcion' => 'Descripción actualizada',
            'precio' => 300.00,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('service_type.nombre', 'Nombre actualizado');
    }

    public function test_admin_can_logically_delete_service_type(): void
    {
        $type = ServiceType::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson("/api/service-types/{$type->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('service_types', [
            'id' => $type->id,
            'activo' => false,
        ]);
    }

    public function test_any_authenticated_user_can_list(): void
    {
        ServiceType::factory()->count(3)->create();

        $response = $this->actingAs($this->tech)->getJson('/api/service-types');
        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_duplicate_name_is_rejected(): void
    {
        ServiceType::factory()->create(['nombre' => 'Único']);

        $response = $this->actingAs($this->admin)->postJson('/api/service-types', [
            'nombre' => 'Único',
            'precio' => 100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }
}
