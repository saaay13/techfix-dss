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
use App\Models\ComponentUsage;
use App\Models\Activity;
use App\Models\ActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceOrderPdfTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private ServiceOrder $order;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::factory()->create(['nombre' => 'Técnico']);
        $this->user = User::factory()->create(['role_id' => $role->id]);

        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();

        $this->order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_download_pdf()
    {
        $response = $this->getJson("/api/service-orders/{$this->order->id}/pdf");

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_download_pdf()
    {
        $response = $this->actingAs($this->user)
            ->get("/api/service-orders/{$this->order->id}/pdf");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $response->assertHeader('Content-Disposition', "attachment; filename=hoja-servicio-{$this->order->id}.pdf");
    }

    public function test_pdf_returns_404_for_nonexistent_order()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/service-orders/99999/pdf');

        $response->assertStatus(404);
        $response->assertJson(['message' => 'Orden de servicio no encontrada.']);
    }

    public function test_pdf_content_contains_order_data()
    {
        $response = $this->actingAs($this->user)
            ->get("/api/service-orders/{$this->order->id}/pdf");

        $response->assertStatus(200);
        $content = $response->getContent();

        $this->assertStringContainsString('Hoja de Servicio', $content);
        $this->assertStringContainsString("Orden #{$this->order->id}", $content);
        $this->assertStringContainsString($this->order->client->nombre, $content);
        $this->assertStringContainsString($this->order->device->marca, $content);
    }

    public function test_pdf_includes_components_and_activities()
    {
        $component = Component::factory()->create(['precio_unitario' => 25.50]);
        ComponentUsage::create([
            'service_order_id' => $this->order->id,
            'component_id' => $component->id,
            'cantidad' => 2,
            'precio_unitario' => 25.50,
        ]);

        $activity = Activity::factory()->create(['nombre' => 'Diagnóstico']);
        ActivityLog::create([
            'service_order_id' => $this->order->id,
            'activity_id' => $activity->id,
            'user_id' => $this->user->id,
            'descripcion_personalizada' => 'Prueba de diagnóstico',
        ]);

        $response = $this->actingAs($this->user)
            ->get("/api/service-orders/{$this->order->id}/pdf");

        $response->assertStatus(200);
        $content = $response->getContent();

        $this->assertStringContainsString('Componentes Utilizados', $content);
        $this->assertStringContainsString($component->nombre, $content);
        $this->assertStringContainsString('Actividades Realizadas', $content);
        $this->assertStringContainsString('Diagnóstico', $content);
    }
}