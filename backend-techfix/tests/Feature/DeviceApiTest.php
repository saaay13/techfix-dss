<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Client;
use App\Models\Device;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DeviceApiTest extends TestCase
{
    use RefreshDatabase;

    // HU-02: Pruebas de integración del CRUD de equipos.
    // Verifica registro, listado, actualización, desactivación
    // y validación de unicidad del número de serie.
    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_can_create_device(): void
    {
        $client = Client::factory()->create();

        $response = $this->postJson('/api/devices', [
            'tipo_equipo' => 'Laptop',
            'marca' => 'Dell',
            'modelo' => 'XPS 15',
            'numero_serie' => 'SN123456789',
            'estado_fisico' => 'Bueno',
            'client_id' => $client->id,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Equipo registrado exitosamente.',
            ]);

        $this->assertDatabaseHas('devices', [
            'numero_serie' => 'SN123456789',
            'client_id' => $client->id,
        ]);
    }

    public function test_duplicate_serial_number_returns_422(): void
    {
        $client = Client::factory()->create();
        Device::factory()->create([
            'numero_serie' => 'SN999999',
            'client_id' => $client->id,
        ]);

        $response = $this->postJson('/api/devices', [
            'tipo_equipo' => 'PC',
            'marca' => 'HP',
            'modelo' => 'Pavilion',
            'numero_serie' => 'SN999999',
            'client_id' => $client->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['numero_serie']);
    }

    public function test_requires_valid_device_type(): void
    {
        $client = Client::factory()->create();

        $response = $this->postJson('/api/devices', [
            'tipo_equipo' => 'Tablet',
            'marca' => 'Samsung',
            'modelo' => 'Tab S9',
            'numero_serie' => 'SN555',
            'client_id' => $client->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tipo_equipo']);
    }

    public function test_requires_existing_client(): void
    {
        $response = $this->postJson('/api/devices', [
            'tipo_equipo' => 'PC',
            'marca' => 'HP',
            'modelo' => 'Pavilion',
            'numero_serie' => 'SN777',
            'client_id' => 9999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id']);
    }

    public function test_can_list_devices(): void
    {
        $client = Client::factory()->create();
        Device::factory()->count(3)->create(['client_id' => $client->id]);

        $response = $this->getJson('/api/devices');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }
}
