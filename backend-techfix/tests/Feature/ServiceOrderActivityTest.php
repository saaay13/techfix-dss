<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Client;
use App\Models\Device;
use App\Models\ServiceOrder;
use App\Models\ServiceOrderItem;
use App\Models\ServiceType;
use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceOrderActivityTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private ServiceOrder $order;
    private ServiceOrderItem $item;
    private Activity $activity;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::factory()->create(['nombre' => 'Técnico']);
        $this->user = User::factory()->create(['role_id' => $role->id]);

        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);

        $this->order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'user_id' => $this->user->id,
        ]);

        $serviceType = ServiceType::factory()->create();
        $this->item = ServiceOrderItem::create([
            'service_order_id' => $this->order->id,
            'service_type_id' => $serviceType->id,
            'descripcion' => 'Servicio de diagnóstico',
            'precio' => 50.00,
        ]);

        $this->activity = Activity::factory()->create(['nombre' => 'Limpieza interna']);
    }

    public function test_unauthenticated_user_cannot_register_activity()
    {
        $response = $this->postJson("/api/service-orders/{$this->order->id}/activities", [
            'activity_id' => $this->activity->id,
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_register_activity()
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/service-orders/{$this->order->id}/activities", [
                'activity_id' => $this->activity->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'activity_log' => ['id', 'activity', 'user', 'descripcion_personalizada', 'created_at'],
            ]);

        $this->assertDatabaseHas('activity_logs', [
            'service_order_item_id' => $this->item->id,
            'activity_id' => $this->activity->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_register_activity_with_custom_description()
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/service-orders/{$this->order->id}/activities", [
                'activity_id' => $this->activity->id,
                'descripcion_personalizada' => 'Se realizó limpieza completa del equipo',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('activity_logs', [
            'descripcion_personalizada' => 'Se realizó limpieza completa del equipo',
        ]);
    }

    public function test_returns_422_for_nonexistent_activity()
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/service-orders/{$this->order->id}/activities", [
                'activity_id' => 99999,
            ]);

        $response->assertStatus(422);
    }

    public function test_returns_422_when_order_has_no_items()
    {
        $emptyOrder = ServiceOrder::factory()->create([
            'client_id' => Client::factory()->create()->id,
            'device_id' => Device::factory()->create()->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/service-orders/{$emptyOrder->id}/activities", [
                'activity_id' => $this->activity->id,
            ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'La orden no tiene servicios asociados. Agregue un servicio antes de registrar actividades.']);
    }

    public function test_activity_id_is_required()
    {
        $response = $this->actingAs($this->user)
            ->postJson("/api/service-orders/{$this->order->id}/activities", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activity_id']);
    }

    public function test_authenticated_user_can_list_activities()
    {
        Activity::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonCount(4);
    }

    public function test_unauthenticated_user_cannot_list_activities()
    {
        $response = $this->getJson('/api/activities');
        $response->assertStatus(401);
    }
}