<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Client;
use App\Models\Device;
use App\Models\ServiceOrder;
use App\Models\ServiceType;
use App\Models\Component;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SearchFilterTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $techRole = Role::factory()->create(['nombre' => 'Técnico']);
        $adminRole = Role::factory()->create(['nombre' => 'Administrador']);
        $this->user = User::factory()->create(['role_id' => $techRole->id]);
        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
    }

    public function test_search_clients_by_name()
    {
        Client::factory()->create(['nombre' => 'Carlos', 'apellido' => 'Mendoza']);
        Client::factory()->create(['nombre' => 'Maria', 'apellido' => 'Lopez']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/clients?search=Carlos');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotNull($data);
        $this->assertStringContainsString('Carlos', $data[0]['nombre']);
    }

    public function test_search_devices_by_model()
    {
        Device::factory()->create(['modelo' => 'ThinkPad X1']);
        Device::factory()->create(['modelo' => 'MacBook Pro']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/devices?search=ThinkPad');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
    }

    public function test_filter_orders_by_estado()
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->user->id,
            'estado' => 'Recibido',
        ]);
        ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->user->id,
            'estado' => 'Finalizado',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/service-orders?estado=Recibido');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
        $this->assertEquals('Recibido', $items[0]['estado']);
    }

    public function test_filter_orders_by_prioridad()
    {
        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->user->id,
            'prioridad' => 'Alta',
        ]);
        ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->user->id,
            'prioridad' => 'Baja',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/service-orders?prioridad=Alta');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
        $this->assertEquals('Alta', $items[0]['prioridad']);
    }

    public function test_search_components_by_name()
    {
        $category = Category::factory()->create();
        Component::create(['nombre' => 'Disco SSD', 'descripcion' => 'SSD 1TB', 'cantidad' => 10, 'stock_minimo' => 2, 'precio_unitario' => 100, 'category_id' => $category->id]);
        Component::create(['nombre' => 'Memoria RAM', 'descripcion' => 'DDR4 16GB', 'cantidad' => 5, 'stock_minimo' => 2, 'precio_unitario' => 80, 'category_id' => $category->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/components?search=SSD');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
    }

    public function test_filter_components_by_category()
    {
        $cat1 = Category::factory()->create();
        $cat2 = Category::factory()->create();
        Component::create(['nombre' => 'Teclado', 'descripcion' => 'USB', 'cantidad' => 10, 'stock_minimo' => 2, 'precio_unitario' => 25, 'category_id' => $cat1->id]);
        Component::create(['nombre' => 'Mouse', 'descripcion' => 'USB', 'cantidad' => 10, 'stock_minimo' => 2, 'precio_unitario' => 15, 'category_id' => $cat2->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/components?category_id={$cat1->id}");

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
    }

    public function test_search_users_by_name()
    {
        User::factory()->create(['name' => 'Admin User', 'role_id' => $this->admin->role_id]);
        User::factory()->create(['name' => 'Tech User', 'role_id' => $this->user->role_id]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/users?search=Admin');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
    }

    public function test_search_service_types()
    {
        ServiceType::factory()->create(['nombre' => 'Reparación de PC']);
        ServiceType::factory()->create(['nombre' => 'Mantenimiento']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/service-types?search=Reparación');

        $response->assertStatus(200);
        $content = $response->json();
        $items = isset($content['data']) ? $content['data'] : $content;
        $this->assertCount(1, $items);
    }

    public function test_search_case_insensitive()
    {
        Client::factory()->create(['nombre' => 'CARLOS']);
        Client::factory()->create(['nombre' => 'Maria']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/clients?search=carlos');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
    }

    public function test_pagination_parameter()
    {
        Client::factory()->count(15)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/clients?per_page=5');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'total', 'per_page']);
        $this->assertEquals(5, $response->json('per_page'));
    }
}