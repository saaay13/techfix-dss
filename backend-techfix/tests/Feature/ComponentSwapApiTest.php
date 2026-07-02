<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\ServiceOrder;
use App\Models\Component;
use App\Models\Category;
use App\Models\Client;
use App\Models\Device;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ComponentSwapApiTest extends TestCase
{
    use RefreshDatabase;

    // HU-07: Pruebas de integración para el flujo completo de cambio de componente.
    // Se prueban: registro exitoso, validación de componentes existentes,
    // listado de cambios, y valor por defecto de devuelto_al_cliente.
    private ServiceOrder $order;
    private Component $componentRetirado;
    private Component $componentInstalado;
    private User $tech;

    // Configura datos base: un técnico, una orden, y dos componentes en inventario
    protected function setUp(): void
    {
        parent::setUp();

        $techRole = Role::factory()->create(['nombre' => 'Técnico']);
        $this->tech = User::factory()->create(['role_id' => $techRole->id]);

        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $category = Category::factory()->create();

        $this->order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->tech->id,
        ]);

        $this->componentRetirado = Component::factory()->create([
            'category_id' => $category->id,
            'cantidad' => 10,
        ]);

        $this->componentInstalado = Component::factory()->create([
            'category_id' => $category->id,
            'cantidad' => 5,
        ]);
    }

    // Verifica que un técnico pueda registrar un cambio completo (retirado + instalado)
    // y que ambos detalles se persistan correctamente en swap_details
    public function test_technician_can_register_component_swap(): void
    {
        $response = $this->actingAs($this->tech)->postJson('/api/component-swaps', [
            'service_order_id' => $this->order->id,
            'observaciones' => 'Cambio de disco duro',
            'devuelto_al_cliente' => true,
            'retirado_component_id' => $this->componentRetirado->id,
            'retirado_cantidad' => 1,
            'instalado_component_id' => $this->componentInstalado->id,
            'instalado_cantidad' => 1,
        ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Cambio de componente registrado exitosamente.']);

        $this->assertDatabaseHas('component_swaps', [
            'service_order_id' => $this->order->id,
            'devuelto_al_cliente' => true,
        ]);

        $this->assertDatabaseHas('swap_details', [
            'tipo' => 'retirado',
            'component_id' => $this->componentRetirado->id,
            'cantidad' => 1,
        ]);

        $this->assertDatabaseHas('swap_details', [
            'tipo' => 'instalado',
            'component_id' => $this->componentInstalado->id,
            'cantidad' => 1,
        ]);
    }

    // Verifica que IDs inexistentes de componente retirado/instalado sean rechazados con 422
    public function test_requires_valid_components(): void
    {
        $response = $this->actingAs($this->tech)->postJson('/api/component-swaps', [
            'service_order_id' => $this->order->id,
            'retirado_component_id' => 9999,
            'retirado_cantidad' => 1,
            'instalado_component_id' => 9999,
            'instalado_cantidad' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['retirado_component_id', 'instalado_component_id']);
    }

    // Verifica que el endpoint GET devuelva el listado de cambios con sus detalles
    public function test_can_list_swaps(): void
    {
        $swap = \App\Models\ComponentSwap::factory()->create([
            'service_order_id' => $this->order->id,
            'devuelto_al_cliente' => false,
        ]);

        \App\Models\SwapDetail::factory()->create([
            'component_swap_id' => $swap->id,
            'component_id' => $this->componentRetirado->id,
            'tipo' => 'retirado',
        ]);

        \App\Models\SwapDetail::factory()->create([
            'component_swap_id' => $swap->id,
            'component_id' => $this->componentInstalado->id,
            'tipo' => 'instalado',
        ]);

        $response = $this->actingAs($this->tech)->getJson('/api/component-swaps');
        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    // Verifica que el campo devuelto_al_cliente tenga por defecto false cuando no se envía
    public function test_devuelto_al_cliente_defaults_to_false(): void
    {
        $response = $this->actingAs($this->tech)->postJson('/api/component-swaps', [
            'service_order_id' => $this->order->id,
            'retirado_component_id' => $this->componentRetirado->id,
            'retirado_cantidad' => 1,
            'instalado_component_id' => $this->componentInstalado->id,
            'instalado_cantidad' => 1,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('component_swaps', [
            'id' => $response->json('component_swap.id'),
            'devuelto_al_cliente' => false,
        ]);
    }
}
