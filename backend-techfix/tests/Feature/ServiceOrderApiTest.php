<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Client;
use App\Models\Device;
use App\Models\ServiceType;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceOrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_service_order(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();
        $user = User::factory()->create();

        $response = $this->postJson('/api/service-orders', [
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'diagnostico_inicial' => 'El equipo no enciende y presenta golpes en la carcasa.',
            'prioridad' => 'Alta',
            'fecha_estimada_entrega' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Orden de servicio creada exitosamente.',
            ]);

        $this->assertDatabaseHas('service_orders', [
            'client_id' => $client->id,
            'device_id' => $device->id,
            'estado' => 'Recibido',
            'prioridad' => 'Alta',
        ]);
    }

    public function test_default_state_is_recibido(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();
        User::factory()->create(['id' => 1]);

        $response = $this->postJson('/api/service-orders', [
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'diagnostico_inicial' => 'Diagnóstico de prueba.',
            'prioridad' => 'Baja',
        ]);

        $response->assertStatus(201);
        $this->assertEquals('Recibido', $response->json('service_order.estado'));
    }

    public function test_requires_existing_client_and_device(): void
    {
        $serviceType = ServiceType::factory()->create();

        $response = $this->postJson('/api/service-orders', [
            'client_id' => 9999,
            'device_id' => 9999,
            'service_type_id' => $serviceType->id,
            'diagnostico_inicial' => 'Test.',
            'prioridad' => 'Media',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id', 'device_id']);
    }

    public function test_requires_valid_priority(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();

        $response = $this->postJson('/api/service-orders', [
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'diagnostico_inicial' => 'Test.',
            'prioridad' => 'Urgente',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['prioridad']);
    }

    public function test_can_list_service_orders(): void
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();
        $user = User::factory()->create();

        ServiceOrder::factory()->count(3)->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/service-orders');
        $response->assertStatus(200)
            ->assertJsonCount(3);
    }
}
