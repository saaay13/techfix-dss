<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\ServiceOrder;
use App\Models\Payment;
use App\Models\Component;
use App\Models\Category;
use App\Models\Client;
use App\Models\Device;
use App\Models\ServiceType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function loginAsAdmin(): string
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

        return $login->json('token');
    }

    public function test_dashboard_returns_kpis(): void
    {
        $token = $this->loginAsAdmin();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'monthly_income',
                'top_services',
                'top_failed_devices',
                'critical_stock',
                'pending_orders_count',
            ]);
    }

    public function test_dashboard_counts_pending_orders(): void
    {
        $token = $this->loginAsAdmin();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonPath('pending_orders_count', 0);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(401);
    }
}
