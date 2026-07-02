<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Client;
use App\Models\Device;
use App\Models\User;
use App\Models\Role;
use App\Models\ServiceOrder;
use App\Models\ServiceType;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceOrderApiTest extends TestCase
{
    use RefreshDatabase;

    // HU-04: Pruebas de integración del CRUD de órdenes de servicio.
    // Verifica creación con estado Recibido, prioridad, actualización
    // y validación de existencia de cliente/equipo/tipo servicio.
    private function authHeaders(): array
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
        $token = $login->json('token');
        return ['Authorization' => "Bearer $token"];
    }

    public function test_can_create_service_order(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/service-orders', [
                'client_id' => $client->id,
                'device_id' => $device->id,
                'service_type_id' => $serviceType->id,
                'diagnostico_inicial' => 'El equipo no enciende',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->addDays(3)->toDateString(),
                'observaciones' => 'Cliente informa que dejó caer el equipo',
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Orden de servicio creada exitosamente.']);

        $this->assertDatabaseHas('service_orders', [
            'client_id' => $client->id,
            'device_id' => $device->id,
            'estado' => 'Recibido',
            'prioridad' => 'Alta',
        ]);
    }

    public function test_create_order_requires_valid_client(): void
    {
        $device = Device::factory()->create();
        $serviceType = ServiceType::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/service-orders', [
                'client_id' => 9999,
                'device_id' => $device->id,
                'service_type_id' => $serviceType->id,
                'diagnostico_inicial' => 'Test',
                'prioridad' => 'Media',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id']);
    }

    public function test_can_list_service_orders(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        ServiceOrder::factory()->count(2)->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/service-orders');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_can_show_service_order(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson("/api/service-orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $order->id);
    }

    public function test_can_update_service_order(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'estado' => 'Recibido',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/service-orders/{$order->id}", [
                'estado' => 'Diagnóstico',
                'diagnostico_inicial' => 'Diagnóstico actualizado',
            ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Orden de servicio actualizada exitosamente.']);

        $this->assertDatabaseHas('service_orders', [
            'id' => $order->id,
            'estado' => 'Diagnóstico',
        ]);
    }

    public function test_can_delete_service_order(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/service-orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Orden de servicio eliminada exitosamente.']);

        $this->assertDatabaseMissing('service_orders', ['id' => $order->id]);
    }

    public function test_requires_valid_priority(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/service-orders', [
                'client_id' => $client->id,
                'device_id' => $device->id,
                'service_type_id' => $serviceType->id,
                'diagnostico_inicial' => 'Test',
                'prioridad' => 'Urgente',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['prioridad']);
    }

    public function test_requires_valid_estado_on_update(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/service-orders/{$order->id}", [
                'estado' => 'Invalido',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['estado']);
    }
}
