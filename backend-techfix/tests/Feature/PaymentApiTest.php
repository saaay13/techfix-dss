<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\ServiceOrder;
use App\Models\Client;
use App\Models\Device;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    // HU-08: Pruebas de integración del módulo de pagos.
    // Cubre: registro exitoso, validación de saldo, monto negativo,
    // método inválido, restricción de rol, listado y resumen por orden.
    private ServiceOrder $order;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role_id' => \App\Models\Role::factory()->create(['nombre' => 'Administrador'])->id,
        ]);

        $client = Client::factory()->create();
        $device = Device::factory()->create(['client_id' => $client->id]);
        $serviceType = ServiceType::factory()->create();

        $this->order = ServiceOrder::factory()->create([
            'client_id' => $client->id,
            'device_id' => $device->id,
            'service_type_id' => $serviceType->id,
            'user_id' => $this->admin->id,
            'costo_total' => 500.00,
            'estado' => 'Finalizado',
        ]);
    }

    // Verifica que el pago se complete correctamente con datos válidos
    public function test_admin_can_register_payment(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'service_order_id' => $this->order->id,
            'monto' => 200.00,
            'metodo_pago' => 'Transferencia',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Pago registrado exitosamente.',
            ]);

        $this->assertDatabaseHas('payments', [
            'service_order_id' => $this->order->id,
            'monto' => 200.00,
            'metodo_pago' => 'Transferencia',
        ]);
    }

    // Verifica que un pago mayor al saldo restante sea rechazado con 422
    public function test_payment_exceeding_balance_is_rejected(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'service_order_id' => $this->order->id,
            'monto' => 600.00,
            'metodo_pago' => 'Tarjeta',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'El pago excede el saldo restante.',
            ]);
    }

    // Verifica que monto negativo sea rechazado por la validación del FormRequest
    public function test_negative_amount_is_rejected(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'service_order_id' => $this->order->id,
            'monto' => -100,
            'metodo_pago' => 'Efectivo',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['monto']);
    }

    // Verifica que métodos no permitidos sean rechazados
    public function test_invalid_payment_method_is_rejected(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'service_order_id' => $this->order->id,
            'monto' => 100,
            'metodo_pago' => 'Cripto',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['metodo_pago']);
    }

    // Verifica que un técnico no pueda registrar pagos (solo administradores)
    public function test_non_admin_cannot_register_payment(): void
    {
        $user = User::factory()->create([
            'role_id' => \App\Models\Role::factory()->create(['nombre' => 'Técnico'])->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/payments', [
            'service_order_id' => $this->order->id,
            'monto' => 100,
            'metodo_pago' => 'Efectivo',
        ]);

        $response->assertStatus(403);
    }

    // Verifica que el endpoint GET /payments devuelva todos los pagos
    public function test_can_list_payments(): void
    {
        Payment::factory()->count(3)->create([
            'service_order_id' => $this->order->id,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/payments');
        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    // Verifica que el endpoint por orden devuelva totales correctos
    public function test_by_order_returns_balance_info(): void
    {
        Payment::factory()->create([
            'service_order_id' => $this->order->id,
            'monto' => 200.00,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/service-orders/{$this->order->id}/payments");

        $response->assertStatus(200)
            ->assertJson([
                'costo_total' => 500.00,
                'total_pagado' => 200.00,
                'saldo_restante' => 300.00,
            ]);
    }
}
