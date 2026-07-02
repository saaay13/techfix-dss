<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Component;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CriticalStockTest extends TestCase
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

    public function test_returns_components_below_minimum_stock(): void
    {
        $token = $this->loginAsAdmin();
        $category = Category::factory()->create();

        Component::create([
            'nombre' => 'Pantalla rota',
            'cantidad' => 2,
            'stock_minimo' => 5,
            'precio_unitario' => 100,
            'activo' => true,
            'category_id' => $category->id,
        ]);

        Component::create([
            'nombre' => 'Componente OK',
            'cantidad' => 20,
            'stock_minimo' => 5,
            'precio_unitario' => 50,
            'activo' => true,
            'category_id' => $category->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/components/critical-stock');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.nombre', 'Pantalla rota');
    }

    public function test_excludes_inactive_components(): void
    {
        $token = $this->loginAsAdmin();
        $category = Category::factory()->create();

        Component::create([
            'nombre' => 'Inactivo',
            'cantidad' => 0,
            'stock_minimo' => 5,
            'precio_unitario' => 100,
            'activo' => false,
            'category_id' => $category->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/components/critical-stock');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_returns_empty_when_all_stock_ok(): void
    {
        $token = $this->loginAsAdmin();
        $category = Category::factory()->create();

        Component::create([
            'nombre' => 'OK',
            'cantidad' => 50,
            'stock_minimo' => 5,
            'precio_unitario' => 10,
            'activo' => true,
            'category_id' => $category->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/components/critical-stock');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/components/critical-stock');
        $response->assertStatus(401);
    }
}
