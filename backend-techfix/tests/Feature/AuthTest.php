<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_valid_credentials_returns_token(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('12345678'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_login_with_invalid_credentials_returns_401(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'test@test.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(422);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('12345678'),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $token = $loginResponse->json('token');

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sesión cerrada']);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('12345678'),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $token = $loginResponse->json('token');

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson(['id' => $user->id]);
    }

    public function test_me_without_token_returns_401(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_login_rate_limiting(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email' => 'test@test.com',
                'password' => 'wrong',
            ]);
        }

        $response = $this->postJson('/api/login', [
            'email' => 'test@test.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(429);
    }
}
